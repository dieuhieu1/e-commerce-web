const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Order = require("../models/Order");
const { log } = require("console");

// ===== ADVANCED MIGRATION WITH BACKUP & ROLLBACK =====

class OrderMigration {
  constructor() {
    this.backupFile = path.join(__dirname, `backup-orders-${Date.now()}.json`);
    this.migrationLog = [];
  }

  // Connect to database
  async connect() {
    log;
    try {
      await mongoose.connect(
        process.env.DB_URL || "mongodb://localhost:27017/e-commerce-db"
      );
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ Connection failed:", error);
      throw error;
    }
  }

  // Backup orders before migration
  async backupOrders() {
    try {
      console.log("\n📦 Creating backup...");

      const ordersToBackup = await Order.find({
        $or: [
          { orderId: { $exists: false } },
          { orderId: null },
          { orderId: "" },
        ],
      }).lean();

      fs.writeFileSync(
        this.backupFile,
        JSON.stringify(ordersToBackup, null, 2),
        "utf-8"
      );

      console.log(`✅ Backup created: ${this.backupFile}`);
      console.log(`   Backed up ${ordersToBackup.length} orders`);

      return ordersToBackup.length;
    } catch (error) {
      console.error("❌ Backup failed:", error);
      throw error;
    }
  }

  // Generate unique orderId
  generateOrderId(date, sequence) {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const seq = String(sequence).padStart(4, "0");
    return `ORD-${dateStr}-${seq}`;
  }

  // Generate fallback orderId if duplicate
  generateFallbackOrderId(date) {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD-${dateStr}-${timestamp}-${random}`;
  }

  // Migrate orders
  async migrate() {
    try {
      console.log("\n🚀 Starting migration...\n");

      // Find orders without orderId
      const orders = await Order.find({
        $or: [
          { orderId: { $exists: false } },
          { orderId: null },
          { orderId: "" },
        ],
      }).sort({ createdAt: 1 });

      if (orders.length === 0) {
        console.log("✅ No orders to migrate!");
        return { success: 0, failed: 0 };
      }

      console.log(`Found ${orders.length} orders to migrate\n`);

      // Group by date
      const ordersByDate = this.groupOrdersByDate(orders);

      let successCount = 0;
      let failedCount = 0;

      // Process each date
      for (const [dateStr, dateOrders] of Object.entries(ordersByDate)) {
        console.log(
          `\n📅 Processing ${dateOrders.length} orders for ${dateStr}`
        );

        // Get existing count for this date
        const existingCount = await Order.countDocuments({
          orderId: new RegExp(`^ORD-${dateStr}-`),
        });

        console.log(`   Existing orders: ${existingCount}`);

        let sequence = existingCount + 1;

        // Migrate each order
        for (const order of dateOrders) {
          try {
            let orderId;
            let attempts = 0;
            const maxAttempts = 5;

            // Try to generate unique orderId
            while (attempts < maxAttempts) {
              if (attempts === 0) {
                orderId = this.generateOrderId(
                  new Date(order.createdAt),
                  sequence
                );
              } else {
                orderId = this.generateFallbackOrderId(
                  new Date(order.createdAt)
                );
              }

              // Check if exists
              const exists = await Order.findOne({ orderId });

              if (!exists) {
                break; // Unique orderId found
              }

              attempts++;
              console.log(
                `   ⚠️  Duplicate detected, retry ${attempts}/${maxAttempts}`
              );
            }

            if (attempts >= maxAttempts) {
              throw new Error("Failed to generate unique orderId");
            }

            // Update order
            await Order.updateOne({ _id: order._id }, { $set: { orderId } });

            this.migrationLog.push({
              _id: order._id.toString(),
              oldOrderId: order.orderId || null,
              newOrderId: orderId,
              status: "success",
            });

            successCount++;
            sequence++;

            console.log(`   ✅ ${order._id} → ${orderId}`);
          } catch (error) {
            this.migrationLog.push({
              _id: order._id.toString(),
              error: error.message,
              status: "failed",
            });

            failedCount++;
            console.error(`   ❌ ${order._id}: ${error.message}`);
          }
        }
      }

      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  // Group orders by date
  groupOrdersByDate(orders) {
    const grouped = {};

    orders.forEach((order) => {
      const dateStr = new Date(order.createdAt)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }

      grouped[dateStr].push(order);
    });

    return grouped;
  }

  // Save migration log
  saveMigrationLog() {
    const logFile = path.join(__dirname, `migration-log-${Date.now()}.json`);

    fs.writeFileSync(
      logFile,
      JSON.stringify(this.migrationLog, null, 2),
      "utf-8"
    );

    console.log(`\n📝 Migration log saved: ${logFile}`);
  }

  // Verify migration
  async verify() {
    console.log("\n🔍 Verifying migration...");

    const remaining = await Order.countDocuments({
      $or: [
        { orderId: { $exists: false } },
        { orderId: null },
        { orderId: "" },
      ],
    });

    if (remaining === 0) {
      console.log("✅ All orders migrated successfully!");
      return true;
    } else {
      console.log(`⚠️  ${remaining} orders still without orderId`);
      return false;
    }
  }

  // Rollback migration
  async rollback() {
    try {
      console.log("\n🔄 Rolling back migration...");

      if (!fs.existsSync(this.backupFile)) {
        throw new Error("Backup file not found!");
      }

      const backup = JSON.parse(fs.readFileSync(this.backupFile, "utf-8"));

      for (const order of backup) {
        await Order.updateOne({ _id: order._id }, { $unset: { orderId: "" } });
      }

      console.log("✅ Rollback completed!");
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      throw error;
    }
  }

  // Print summary
  printSummary(result) {
    console.log("\n" + "=".repeat(60));
    console.log("MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${result.success} orders`);
    console.log(`❌ Failed: ${result.failed} orders`);
    console.log(`📦 Backup file: ${this.backupFile}`);
    console.log("=".repeat(60));
  }

  // Close connection
  async close() {
    await mongoose.connection.close();
    console.log("\n✅ MongoDB connection closed");
  }
}

// ===== RUN MIGRATION =====

const runMigration = async () => {
  const migration = new OrderMigration();

  try {
    // Step 1: Connect
    await migration.connect();

    // Step 2: Backup
    const backupCount = await migration.backupOrders();

    if (backupCount === 0) {
      console.log("✅ No migration needed!");
      await migration.close();
      return;
    }

    // Step 3: Confirm
    console.log("\n⚠️  Are you sure you want to proceed?");
    console.log("   This will modify your database.");
    console.log("   Backup has been created.");
    console.log(
      "\n   Press Ctrl+C to cancel or wait 5 seconds to continue...\n"
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 4: Migrate
    const result = await migration.migrate();

    // Step 5: Save log
    migration.saveMigrationLog();

    // Step 6: Verify
    await migration.verify();

    // Step 7: Summary
    migration.printSummary(result);

    // Step 8: Close
    await migration.close();

    console.log("\n🎉 Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration process failed:", error);

    // Attempt rollback
    console.log("\n⚠️  Attempting rollback...");
    try {
      await migration.rollback();
    } catch (rollbackError) {
      console.error("❌ Rollback also failed:", rollbackError);
      console.error("   Please restore from backup manually!");
    }

    await migration.close();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = OrderMigration;
