import './BeyondStrangelove.css'; 

export default function BeyondStrangelove() {
  return (
    <div style={{justifyContent: 'center', margin: "auto"}}>
      <h1>Press the Button to Navigate Beyond</h1>
      <button className="button">
        <div className="lid">
          <span className="side top"></span>
          <span className="side front"></span>
          <span className="side back"></span>
          <span className="side left"></span>
          <span className="side right"></span>
        </div>
        <div className="panels">
          <div className="panel-1">
            <div className="panel-2">
              <div className="btn-trigger">
                <span className="btn-trigger-1"></span>
                <span className="btn-trigger-2"></span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
