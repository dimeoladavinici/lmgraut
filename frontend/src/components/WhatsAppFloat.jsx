import waIcon from "../assets/whatsapp.svg";

function WhatsAppFloat() {
    const numero = "5492396442868";
    const mensaje = encodeURIComponent("Hola, vi un vehículo en la web y quiero más info.");
    const url = `https://wa.me/${numero}?text=${mensaje}`;

    return (
        <a
            href={url}
            className="wa-float"
            target="_blank"
            rel="noreferrer"
        >
            <img src={waIcon} alt="WhatsApp" className="wa-icon-img" />
        </a>
    );
}

export default WhatsAppFloat;
