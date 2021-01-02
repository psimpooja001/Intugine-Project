import React from 'react';

const ScanReport = (props) => {
  return(
    (props.parcel) ?             
      (props.parcel.scan && props.parcel.scan.length > 0) ?
        <>
        <label className="awb-header" >AWB: #{props.parcel.awbno}</label>
        <ul className="scan-report">
        <li className="icon-only">
            <img src="/images/destination.svg" height="25px" width="25px"/>
        </li>
            {props.parcel.scan.map(scan =>
            <li>
                <label className={scan.status_detail && scan.status_detail === "DELIVERED" ? "delivered" : ""}>
                <span>{scan.location}</span>
                <span>{scan.time ? new Date(Date.parse(scan.time)).toLocaleString([],{ hour12: false }): ""}</span>
                </label>
            </li>
            )}
        <li className="icon-only">
        <img src="/images/warehouse.svg" height="25px" width="25px"/>
        </li>
        </ul>
        </>
        :   
        <>
        <label className="awb-header" >AWB: #{props.parcel.awbno}</label>
        <div className="empty-scan-report">
            <label>No information yet</label>
        </div>
        </>
    : 
    <div className="empty-scan-report">
        <label>Please click on a parcel row to view the details</label>
    </div>
  )
}

export default ScanReport;
