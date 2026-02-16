function Button({ label, onClick, icon = null, className = "", style = {} }) {

    return <>
        <button onClick={onClick} className={`${className}`} style={style}>
            {label}{icon && <span>{icon}</span>}
        </button>
    </>
}
export default Button;
