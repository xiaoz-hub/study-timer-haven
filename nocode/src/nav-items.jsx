import { HomeIcon } from "lucide-react";
import Index from "./pages/Index.jsx";

/**
 * 番茄钟督学网站导航配置
 * 定义导航项目和对应的路由页面
 */
export const navItems = [
  {
    title: "番茄钟",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
];
