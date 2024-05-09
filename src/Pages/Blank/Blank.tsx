import "./Blank.css"
export default function Blank() {
    return (
        <div style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            margin: "auto",
            padding: "auto",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            border: "1px solid red",
            justifyContent: "center"

        }}>
            <div className="bar">
                <div className="ball"></div>
            </div>
        </div>
    )
}
