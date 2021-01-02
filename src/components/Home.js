import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import ScanReport from './ScanReport';

const postData = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tTU3gFVUdP'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
const sortTypes = {
	up: {
		class: 'sort-up',
		fn: (a, b) => a.awbno - b.awbno
	},
	down: {
		class: 'sort-down',
		fn: (a, b) => b.awbno - a.awbno
	},
	default: {
		class: 'sort',
		fn: (a, b) => a
	}
};
const Home = (props) => {
  //static displayName = Home.name;
  const[parcels, setParcels] = useState([]);
  const[loading, setLoading] = useState(true);
  const[filterTag, setFilterTag] = useState("DEL");
  const[scanId, setScanId] = useState("");
  const[parcelCount, setParcelCount] = useState({OOD: 0, DEL: 0, UND: 0, INT: 0, NFI: 0});
  const[currentSort, setCurrentSort]=useState("default");

  useEffect(() => {
    postData('https://f0ztti2nsk.execute-api.ap-south-1.amazonaws.com/v1/consignment/fetch', { email: "psimpooja@gmail.com" })
    .then(data => {
      data.map(d => {
        parcelCount[d.current_status_code] = parcelCount[d.current_status_code] + 1;
      });
      setParcels(data);
      setLoading(false);
    });
  }, [])
  
  const handleFilterChange = (changeEvent) => {
    if(changeEvent.target.value != filterTag){    
      setFilterTag(changeEvent.target.value);
    }
  }
  const fetchScanReport = (parcelId) => {
    if(parcelId != scanId)
      setScanId(parcelId);
  }

  const onSortChange = () => {
    let nextSort;
    if (currentSort === 'down') nextSort = 'up';
    else if (currentSort === 'up') nextSort = 'default';
    else if (currentSort === 'default') nextSort = 'down';
    setCurrentSort(nextSort);
  };

  return(
    (loading)
      ?
      <div className="empty-scan-report" style={{height:"calc(100vh - 85px)"}}>
        <Spinner size="lg" color="primary" />
      </div>
      : <>
      <div className="row">
        <div className="col-md-12" style={{textAlign:"center"}}>
          <div className="radio">
            <input type="radio" id="rad_del" name="rad_status" value="DEL" checked={filterTag === "DEL"} onChange={handleFilterChange} />
            <label htmlFor="rad_del">
              <span>DEL</span>
              <span>{parcelCount["DEL"]}</span>
            </label>
          </div>
          <div className="radio">
            <input type="radio" id="rad_int" name="rad_status" value="INT" checked={filterTag === "INT"} onChange={handleFilterChange} />
            <label htmlFor="rad_int">
              <span>INT</span>
              <span>{parcelCount["INT"]}</span>
            </label>
          </div>
          <div className="radio">
            <input type="radio" id="rad_ood" name="rad_status" value="OOD" checked={filterTag === "OOD"} onChange={handleFilterChange} />
            <label htmlFor="rad_ood">
              <span>OOD</span>
              <span>{parcelCount["OOD"]}</span>
            </label>
          </div>
          <div className="radio">
            <input type="radio" id="rad_dex" name="rad_status" value="UND" checked={filterTag === "UND"} onChange={handleFilterChange} />
            <label htmlFor="rad_dex">
              <span>UND</span>
              <span>{parcelCount["UND"]}</span>
            </label>
          </div>
          <div className="radio">
            <input type="radio" id="rad_nfi" name="rad_status" value="NFI" checked={filterTag === "NFI"} onChange={handleFilterChange} />
            <label htmlFor="rad_nfi">
              <span>NFI</span>
              <span>{parcelCount["NFI"]}</span>
            </label>
          </div>
        </div>
      </div>
      <div className="row" style={{height:"calc(100vh - 190px)"}}>
        <div className="col-md-4" style={{height:"100%"}}>
          <div className="card" style={{height:"100%", overflow:"auto"}}>
          <ScanReport parcel={parcels.find(x => x._id === scanId) ? parcels.find(x => x._id === scanId) : null}/>
          </div>
        </div>
        <div className="col-md-8" style={{height:"100%"}}>
          <div className="card" style={{height:"100%", overflow:"auto"}}>
          <table className='table table-striped table-hover table-condensed table-sticky tbl-parcels' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>
                  AWB NUMBER
                  <button className="btn-sort" onClick={onSortChange}>
                    <i className={`fas fa-${sortTypes[currentSort].class}`} />
                  </button>
                </th>
                <th>TRANSPORTER</th>
                <th>SOURCE</th>
                <th>DESTINATION</th>
                <th>BRAND</th>
                <th>START DATE</th>
                <th>ETD</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {parcels.filter((parcel) => {
                return parcel.current_status_code === filterTag;
              }).sort(sortTypes[currentSort].fn).map(parcel =>
                <tr key={parcel._id} onClick={() => fetchScanReport(parcel._id)}>
                  <td>#{parcel.awbno}</td>
                  <td>{parcel.carrier}</td>
                  <td>{parcel.from}</td>
                  <td>{parcel.to}</td>
                  <td>{parcel.carrier}</td>
                  <td>{parcel.pickup_date ? new Date(Date.parse(parcel.pickup_date)).toLocaleDateString(): ""}</td>
                  <td>{parcel.extra_fields && parcel.extra_fields.expected_delivery_date ? new Date(Date.parse(parcel.extra_fields.expected_delivery_date )).toLocaleDateString(): ""}</td>
                  <td className={parcel.current_status_code} >{parcel.current_status}</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      </>
  )
}

export default Home;
