import {Link} from 'react-router-dom';
import {Inbox,LoaderCircle,ArrowLeft} from 'lucide-react';
export function Field({label,id,error,helper,children}){return <div className="field"><label htmlFor={id}>{label}</label>{children}{helper&&<small className="field-help">{helper}</small>}{error&&<small className="field-error" id={`${id}-error`} role="alert">{error}</small>}</div>}
export function EmptyState({title,description,action='Explorar eventos',to='/explorar',emoji='🌱'}){return <div className="empty-state"><span className="empty-emoji">{emoji}</span><h3>{title}</h3><p>{description}</p>{to&&<Link className="btn btn-primary" to={to}>{action}</Link>}</div>}
export function PageBack({to='/inicio',label='Voltar'}){return <Link to={to} className="back-link"><ArrowLeft size={18}/>{label}</Link>}
export function FullLoader(){return <div className="loading-screen"><img src={`${import.meta.env.BASE_URL}logo.svg`} alt=""/><span>ElderConnect</span><LoaderCircle className="spin" size={25}/></div>}
