import { Route, Routes } from "react-router-dom";
import Public from "./pages/public/Public";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "./store/asyncActions";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path="/" element={<Public />}>
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}
