import Logo from "../../assets/Logo_ifrj_horizontal.png";

import "./style.css"

export default function Topo({ onLogout }) {
  return (
    <div className="container">
      <img src={Logo} alt="Logo do Ifrj"/>
      
    </div>
  )
}