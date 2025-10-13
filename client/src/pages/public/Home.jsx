import Sidebar from "../../components/Sidebar";
import Banner from "../../components/Banner";
import BestSeller from "@/components/BestSeller";

const Home = () => {
  return (
    <div className="w-main flex">
      <div className="flex flex-col gap-5 flex-auto w-[25%]">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
        <Banner />
        <BestSeller />
      </div>
    </div>
  );
};

export default Home;
