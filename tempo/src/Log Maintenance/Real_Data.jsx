import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../config";
import Papa from 'papaparse';


function Real_Data() {

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [alldata, setalldata] = useState();
    //dropdown state
    const [dropdown1, setdropdown1] = useState(false);
    const [dropdown2, setdropdown2] = useState(false);

    const [dropdown2value, setdropdown2value] = useState()
    const [selected_device_id, setselected_device_id] = useState();
    const [mac_address, setmac_address] = useState();


    //functions
    const fetch_device_data = async () => {
        try {
            const response = await fetch(`${API_URL}/user`)
            const data = await response.json();

            setalldata(data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleexport = async () => {
        try {
            if (fromdate && todate && selected_device_id) {
                if (fromdate > todate) {
                    alert("fromdate cannot be greater than todate")
                } else {
                    if (dropdown2value) {
                        const body = { mac_address, fromdate, todate }
                        const response1 = await fetch(`${API_URL}/log/realdata`, {
                            method: "POST",
                            headers: { "content-Type": "application/json" },
                            body: JSON.stringify(body)
                        })
                        const data = await response1.json();

                        exportToCsv(data, `${selected_device_id}.csv`);
                    }else{
                        alert("Please Select File Type")
                    }
                }
            }
            else {
                alert("fromdate,todate,device id cannot be empty")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportToCsv = (data, filename) => {
        // Flatten the data
        const flattenedData = data.map((item) => ({
            mac: item.mac,
            dt: item.dt,
            Subtopic: item.Subtopic,
            temp_value: item.temp[0].value,
            pressure_value: item.pressure[0].value,
            flow_value: item.flow[0].value,
        }));

        // Convert flattened data to CSV
        const csv = Papa.unparse(flattenedData);

        // Create a Blob and initiate the download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };




    //dropdown functions
    const handledropdown1 = () => {
        setdropdown1(!dropdown1)
    }
    const handledropdown2 = () => {
        setdropdown2(!dropdown2)
    }



    const handledropdown1value = (data) => {
        setselected_device_id(data.device_id)
        setmac_address(data.device_mac_address)
        setdropdown1(false)
    }
    const handledropdown2value = (data) => {
        setdropdown2value(data)
        setdropdown2(false);
    }

    const handlefromdate = (event) => {
        setfromdate(event.target.value)
    }
    const handletodate = (event) => {
        settodate(event.target.value)
    }

    //useeffects
    useEffect(() => {
        fetch_device_data();
    })

    return (
        <>
            <div className="row_with_count_status">
                <span className='module_tittle'>Data Log</span>
            </div>
            <div className="display-flex">
                <div class="dropdown-filter" >
                    <div class="device_filters" onClick={handledropdown1}>
                        <div className="device_name">
                            {selected_device_id ? selected_device_id : 'Device_id'}
                        </div>
                        <div className="dropdown_icon">
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="dropdown-icon"
                            />
                        </div>
                    </div>
                    {dropdown1 && (
                        <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                            {alldata.map((data, index) => (
                                <div className='device_scroll' key={index}>
                                    <div>
                                        <div className='device_dropdown' onClick={() => { handledropdown1value(data) }} style={{ cursor: "pointer" }}>
                                            <div className="div_sts">{data.device_id}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div class="dropdown-filter">
                    <fieldset>
                        <legend class="alert-legend-top">From</legend>
                        <input type='date' class="device_filters dashboard_live_filter1"
                            value={fromdate}
                            onChange={handlefromdate}
                        ></input>
                    </fieldset>
                </div>
                <div class="dropdown-filter">
                    <fieldset>
                        <legend class="alert-legend-top">To</legend>
                        <input type='date' class="device_filters dashboard_live_filter1"
                            value={todate}
                            onChange={handletodate}
                        ></input>
                    </fieldset>
                </div>
            </div>
            <div className="data_log_body">
                <div class="dropdown-filter" >
                    <div class="device_filters" onClick={handledropdown2} >
                        <div className="device_name">
                        {dropdown2value ? dropdown2value : 'File Type'}
                        </div>
                        <div className="dropdown_icon">
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="dropdown-icon"
                            />
                        </div>
                    </div>
                    {dropdown2 && (
                        <div className="dropdown_menu2 dashboard_dropdown-menu dropdown-colors">
                            <div>
                                <div className='device_dropdown' onClick={() => { handledropdown2value('CSV') }}>
                                    <div className="div_sts">CSV</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="data_log_export" onClick={handleexport}>
                    Export
                </div>

            </div>
        </>
    )
}

export default Real_Data;