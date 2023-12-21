import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'react-icons-kit';
import { ic_label_important } from 'react-icons-kit/md/ic_label_important';



function Events() {

    //data states
    const [alldata, setalldata] = useState();
    const [total_device_id, settotal_device_id] = useState();
    const [total_device_version, settotal_device_version] = useState();
    const [reboot_count, setreboot_count] = useState();
    const [reset_count, setreset_count] = useState();
    const [fmupdate_count, setfmupdate_count] = useState();

    //dropdown states
    const [dropdown1, setdropdown1] = useState()
    const [dropdown2, setdropdown2] = useState()
    const [dropdown3, setdropdown3] = useState();

    const [selected_device_id, setselected_device_id] = useState();
    const [selected_event, setselected_event] = useState();
    const [selected_device_version, setselected_device_version] = useState();

    //functions
    const get_data = async (option, index) => {
        try {
            const response = await fetch(`${API_URL}/log/event`)
            const data = await response.json();


            const uniqueDeviceIds = [...new Set(data.map(item => item.device_id))];
            const uniquedeviceversions = [...new Set(data.map(item => item.device_firmware_version))];

            settotal_device_id(uniqueDeviceIds);
            settotal_device_version(uniquedeviceversions)

            const count1 = data.filter(item => item.event === 'reboot');
            const count2 = data.filter(item => item.event === 'reset');
            const count3 = data.filter(item => item.event === 'fmupdate');

            setreboot_count(count1.length);
            setreset_count(count2.length);
            setfmupdate_count(count3.length);


            let filteredData1;
            if (index === '0') {
                if (option === 'ALL') {
                    filteredData1 = data;
                } else {
                    filteredData1 = data.filter(item => item.device_id === option);
                }
            } else if (index === '1') {
                if (option === 'ALL') {
                    filteredData1 = data;
                }
                else {
                    filteredData1 = data.filter(item => item.event === option)
                }
            } else if (index === '2') {
                if (option === 'ALL') {
                    filteredData1 = data;
                }
                else {
                    filteredData1 = data.filter(item => item.device_firmware_version === option)
                }
            }
            else {
                filteredData1 = data;
            }

            setalldata(filteredData1)
        } catch (error) {
            console.log(error)
        }
    }


    //dropdown functions
    const handledropdown1 = () => {
        setdropdown1(!dropdown1)
    }
    const handledropdown2 = () => {
        setdropdown2(!dropdown2)
    }
    const handledropdown3 = () => {
        setdropdown3(!dropdown3)
    }

    //filter functions
    const device_id_filter = (data) => {
        if (data === selected_device_id) {
            setselected_device_id('All');
            total_filter('All', '0');
        } else {
            setselected_device_id(data);
            total_filter(data, '0');
        }
    }

    const event_filter = (data) => {
        if (data === selected_event) {
            setselected_event('All');
            total_filter('All', '1');
        } else {
            setselected_event(data);
            total_filter(data, '1');
        }
    }

    const device_version_filter = (data) => {
        if (data === selected_device_version) {
            setselected_device_version('All');
            total_filter('All', '2');
        } else {
            setselected_device_version(data);
            total_filter(data, '2');
        }
    }


    const total_filter = (data, index) => {
        get_data(data, index)
    }


    //useeffects
    useEffect(() => {
        get_data()
    }, [])

    return (
        <>
            <div className="row_with_count_status">
                <span className="module_tittle">Event Log</span>
                <div className='status-btns display-flex'>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "green" }}><div style={{ fontSize: "20px", paddingRight: "3px" }}>{reboot_count}</div> Reboot</div>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "red" }}><div style={{ fontSize: "20px", paddingRight: "3px" }}>{reset_count}</div>  Reset</div>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "#00B0F0" }}> <div style={{ fontSize: "20px", paddingRight: "3px" }}>{fmupdate_count}</div> FW Update</div>
                </div>
            </div>
            <div className="row_with_filters">
                <div class="pagination display-flex">
                    <div className="focus-page">
                        <input
                            type="number"
                            value={1}
                            className='editable_input_box'
                        />

                    </div>
                    <div className="upcomming-pages">
                        of 20 pages
                    </div>
                </div>


                <div className='move_head'>
                    <div className='filters1 display-flex'>
                        <div class="dropdown-filter">
                            <div class="device_filters" onClick={handledropdown1}>
                                <div className="device_name">
                                    Device ID
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
                                    {total_device_id.map((data, index) => (
                                        <div className='device_scroll' key={index}>
                                            <div>
                                                <div className='device_dropdown'>
                                                    <input
                                                        className='device_sts_checkbox'
                                                        type="checkbox"
                                                        checked={data === selected_device_id}
                                                        onChange={() => device_id_filter(data)}
                                                    />
                                                    <div className="div_sts">{data}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='device_dropdown'>
                                        <input className='device_sts_checkbox' type="checkbox"
                                            checked={'ALL' === selected_device_id}
                                            onChange={() => device_id_filter('ALL')}
                                        />
                                        <div className="div_sts">ALL</div>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div class="dropdown-filter" >
                            <div class="device_filters" onClick={handledropdown2}>
                                <div className="device_name">
                                    Event
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
                                        <div className='device_dropdown'>
                                            <input
                                                className='device_sts_checkbox'
                                                type="checkbox"
                                                checked={'reboot' === selected_event}
                                                onChange={() => event_filter('reboot')}
                                            />
                                            <div className="div_sts">Reboot</div>
                                        </div>
                                        <div className='device_dropdown'>
                                            <input
                                                className='device_sts_checkbox'
                                                type="checkbox"
                                                checked={'reset' === selected_event}
                                                onChange={() => event_filter('reset')}
                                            />
                                            <div className="div_sts">Reset to Factory</div>
                                        </div>
                                        <div className='device_dropdown'>
                                            <input
                                                className='device_sts_checkbox'
                                                type="checkbox"
                                                checked={'fmupdate' === selected_event}
                                                onChange={() => event_filter('fmupdate')}
                                            />
                                            <div className="div_sts">FW Update</div>
                                        </div>
                                        <div className='device_dropdown'>
                                            <input
                                                className='device_sts_checkbox'
                                                type="checkbox"
                                                checked={'ALL' === selected_event}
                                                onChange={() => event_filter('ALL')}
                                            />
                                            <div className="div_sts">ALL</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="dropdown-filter" >
                            <div class="device_filters" onClick={handledropdown3}>
                                <div className="device_name">
                                    Device Version
                                </div>
                                <div className="dropdown_icon">
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="dropdown-icon"
                                    />
                                </div>
                            </div>
                            {dropdown3 && (
                                <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                                    {total_device_version.map((data, index) => (
                                        <div className='device_scroll' key={index}>
                                            <div>
                                                <div className='device_dropdown'>
                                                    <input
                                                        className='device_sts_checkbox'
                                                        type="checkbox"
                                                        checked={data === selected_device_version}
                                                        onChange={() => device_version_filter(data)}
                                                    />
                                                    <div className="div_sts">{data}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='device_dropdown'>
                                        <input className='device_sts_checkbox' type="checkbox"
                                            checked={'ALL' === selected_device_version}
                                            onChange={() => device_version_filter('ALL')}
                                        />
                                        <div className="div_sts">ALL</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <div className='col-headings'>
                <div className="col-head">Device Id</div>
                <div className="col-head">Device Name</div>
                <div className="col-head">Device Model</div>
                <div className="col-head">Last Updated on</div>
                <div className="col-head">Device Version</div>
                <div className="col-head">Last Updated by</div>
                <div className="col-head">Event</div>
            </div>
            <div className="scroll_div" style={{ overflowY: "auto" }}>
                {alldata ? (alldata.map((item, index) => (
                    <div className="datas skeleton-block" key={index}>
                        <div className="col-head" >{item.device_id}</div>
                        <div className="col-head" >{item.device_name}</div>
                        <div className="col-head" >{item.device_model}</div>
                        <div className="col-head" >{item.last_updated_on.split('T')[0]}</div>
                        <div className="col-head" >{item.device_firmware_version}c</div>
                        <div className="col-head" >admin</div>
                        <div className="col-head" >
                            <div className={`log_event_${item.event} display-flex justify-align`}> {item.event} </div>
                        </div>
                    </div>
                ))) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )

}
export default Events;