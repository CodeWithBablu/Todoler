import Homeicon from "../assets/homeicon";
import Settingicon from "../assets/settingicon";
import Taskicon from "../assets/taskicon";

import Home from "../components/Home";
import Task from "../components/Task";
import Setting from "../components/Setting";

const sidebar = [
  {
    id: 0,
    name: "Home",
    comp: Home,
    icon: Homeicon,
  },
  {
    id: 1,
    name: "Task",
    comp: Task,
    icon: Taskicon,
  },
  {
    id: 2,
    name: "Setting",
    comp: Setting,
    icon: Settingicon,
  }
];


export default sidebar;