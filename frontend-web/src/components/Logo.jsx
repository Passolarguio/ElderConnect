import {Link} from 'react-router-dom';
export default function Logo({light=false,link='/inicio',compact=false}){
 return <Link className={`brand ${light?'brand-light':''}`} to={link} aria-label="ElderConnect - página inicial">
  <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="brand-icon"/>
  {!compact&&<span className="brand-name">Elder<span>Connect</span></span>}
 </Link>;
}
