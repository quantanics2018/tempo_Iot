import React, { useState, useEffect, useRef } from "react";
import { Icon } from 'react-icons-kit';
import { ic_label_important } from 'react-icons-kit/md/ic_label_important';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../config";

const Alert_Management = () => {

    //data states
    const [all_alert_data, setall_alert_data] = useState();
    const [device_name, setdevice_name] = useState();
    const [alert_category, setalert_category] = useState();
    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [notes, setnotes] = useState();
    const [alert_id, setalert_id] = useState();
    const [totalcount, settotalcount] = useState();
    const [action_taken_count, setaction_taken_count] = useState();
    const [action_required_count, setaction_required_count] = useState();

    const [total_device_name, settotal_device_name] = useState();
    const [total_alert_category, settotal_alert_category] = useState();

    //dropdown state
    const [isOpen1, setisOpen1] = useState(false);
    const [isOpen2, setisOpen2] = useState(false);
    const [rotatedindex, setrotatedindex] = useState();

    //bootstrap modal state
    const [modal, setmodal] = useState(true);


    //dropdown function
    const dropdown1 = () => {
        setisOpen1(!isOpen1);
    }
    const dropdown2 = () => {
        setisOpen2(!isOpen2);
    }

    //useref
    const dropdownref1 = useRef(null)
    const dropdownref2 = useRef(null)


    const fetchdata = async (option, index, date) => {
        try {
            const response3 = await fetch(`${API_URL}/management/alert_management`);
            const data = await response3.json();

            settotalcount(data.length);

            const nullNotesCount = data.filter(item => item.notes === null).length;
            const nonNullNotesCount = data.filter(item => item.notes !== null).length;

            setaction_required_count(nullNotesCount)
            setaction_taken_count(nonNullNotesCount)

            const uniqueDevicenames = [...new Set(data.map(item => item.device_name))];
            const uniqueAlertCategories = [...new Set(data.map(item => item.alert_category))];

            settotal_device_name(uniqueDevicenames)
            settotal_alert_category(uniqueAlertCategories);


            let filteredData1;
            if (index === '0') {
                if (option === 'ALL') {
                    filteredData1 = data;
                } else {
                    filteredData1 = data.filter(item => item.device_name === option);
                }
            } else if (index === '1') {
                if (option === 'ALL') {
                    filteredData1 = data;
                }
                else {
                    filteredData1 = data.filter(item => item.alert_category === option)
                }
            } else if (index === '2') {
                filteredData1 = data.filter(item => {
                    const timestamp = new Date(item.timestamp);
                    const fromDate = new Date(fromdate);
                    const toDate = new Date(todate);

                    return timestamp >= fromDate && timestamp <= toDate;
                });
            }
            else {
                filteredData1 = data;
            }

            setall_alert_data(filteredData1);
        } catch (error) {
            console.log(error)
        }
    }

    const handlenotes = (data) => {
        if (data.notes === null) {
            setnotes();
        } else {
            setnotes(data.notes)
        }

        setalert_id(data.alert_id)
    }

    const savedata = async () => {
        try {
            const body = { notes, alert_id }

            const response1 = await fetch(`${API_URL}/management/alert_management`, {
                method: "PUT",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            if (response1) {
                setmodal(true)
                fetchdata();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleactionclick = async (index) => {
        if (rotatedindex === index) {
            setrotatedindex(null);
        } else {
            setrotatedindex(index);
        }
    }

    const device_name_filter = (data) => {
        if (data === device_name) {
            setdevice_name('All');
            total_filter('All', '0');
        } else {
            setdevice_name(data);
            total_filter(data, '0');
        }
    }
    const alert_category_filter = (data) => {
        if (data === alert_category) {
            setalert_category('All');
            total_filter('All', '1');
        } else {
            setalert_category(data);
            total_filter(data, '1');
        }
    }
    const total_filter = (data, index) => {
        fetchdata(data, index)
    }
    const handlefromdate = (event) => {
        setfromdate(event.target.value)
    }
    const handletodate = (event) => {
        settodate(event.target.value)
    }

    useEffect(() => {
        if (fromdate && todate) {
            fetchdata(fromdate, '2', todate);
        }
    }, [fromdate, todate]);

    useEffect(() => {
        fetchdata();
    }, [])


    //userefs
    const empty_space_down1 = (event) => {
        if (!dropdownref1.current.contains(event.target)) {
            setisOpen1(false)
        }
    };
    useEffect(() => {
        document.addEventListener('click', empty_space_down1);
        return () => {
            document.removeEventListener('click', empty_space_down1);
        };
    }, []);



    const empty_space_down2 = (event) => {
        if (!dropdownref2.current.contains(event.target)) {
            setisOpen2(false)
        }
    };
    useEffect(() => {
        document.addEventListener('click', empty_space_down2);
        return () => {
            document.removeEventListener('click', empty_space_down2);
        };
    }, []);






    return (
        <div>
            <div className="Assert">
                <div className="device_management display-flex page_top_box box-shadow">
                    <span className='module_tittle '>Alert Management</span>
                    <div className="display-flex">
                        <div className='status-btns1 display-flex'>
                            <button className='btn-loc1 active-loc1'>0{totalcount} Total Alert</button>
                        </div>
                        <div className='status-btns1 display-flex'>
                            <button className='btn-loc1 active-loc'>0{action_taken_count} Action Taken</button>
                        </div>
                        <div className='status-btns1 display-flex'>
                            <button className='btn-loc1 inactive-loc'>0{action_required_count} Action Needed</button>
                        </div>
                    </div>

                </div>
                <div className='assert_filters display-flex'  >
                    <div class="pagination display-flex">
                        <div className="focus-page">
                            1
                        </div>
                        <div className="upcomming-pages">
                            of 20 pages
                        </div>
                    </div>
                    <div className=' display-flex' >
                        <div class="dropdown-filter" ref={dropdownref1}>
                            <div class="device_filters" onClick={dropdown1}>
                                <div className="device_name"> Device Name </div>
                                <div className="dropdown_icon">
                                    <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                                </div>
                            </div>
                            {isOpen1 && (
                                <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                                    {total_device_name.map((data, index) => (
                                        <div className='device_scroll' key={index}>
                                            <div>
                                                <div className='device_dropdown'>
                                                    <input
                                                        className='device_sts_checkbox'
                                                        type="checkbox"
                                                        checked={data === device_name}
                                                        onChange={() => device_name_filter(data)}

                                                    />
                                                    <div className="div_sts">{data}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}


                                    <div className='device_dropdown'>
                                        <input className='device_sts_checkbox' type="checkbox"
                                            checked={'ALL' === device_name}
                                            onChange={() => device_name_filter('ALL')}
                                        />
                                        <div className="div_sts">ALL</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="dropdown-filter" ref={dropdownref2}>
                            <div class="device_filters" onClick={dropdown2}>
                                <div className="device_name">  Alert Category </div>
                                <div className="dropdown_icon">
                                    <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                                </div>
                            </div>
                            {isOpen2 && (
                                <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                                    {total_alert_category.map((data, index) => (
                                        <div className='device_scroll' key={index}>
                                            <div>
                                                <div className='device_dropdown'>
                                                    <input
                                                        className='device_sts_checkbox'
                                                        type="checkbox"
                                                        checked={data === alert_category}
                                                        onChange={() => alert_category_filter(data)}

                                                    />
                                                    <div className="div_sts">{data}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}


                                    <div className='device_dropdown'>
                                        <input className='device_sts_checkbox' type="checkbox"
                                            checked={alert_category === 'ALL'}
                                            onChange={() => alert_category_filter('ALL')}
                                        />
                                        <div className="div_sts">ALL</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="display-flex alert_date justify-end align-center" style={{ width: "60%" }}>
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
                </div>
                <div className='col-headings'>
                    <div className="col-head">ALERT ID</div>
                    <div className="col-head">DEVICE NAME</div>
                    <div className="col-head">DEVICE ID</div>
                    <div className="col-head">VALUE</div>
                    <div className="col-head">ALERT TYPE</div>
                    <div className="col-head">TIMESTAMP</div>
                    <div className="col-head">ALERT CATEGORY</div>
                    <div className="col-head">NOTES</div>
                </div>
                <div className="scroll_div" style={{ overflowY: "auto" }}>
                    {all_alert_data ? (all_alert_data.map((item, index) => (
                        <div className="datas skeleton-block" key={index}>
                            <div className="col-head">{item.alert_id}</div>
                            <div className="col-head">{item.device_name}</div>
                            <div className="col-head">{item.device_id}</div>
                            <div className="col-head">{item.value}</div>
                            <div className="col-head">{item.alert_type}</div>
                            <div className="col-head">{item.timestamp.split('T')[0]}</div>
                            <div className="col-head"><button className={`alert-page-button alert_configuration_${item.alert_category}`}>{item.alert_category}</button></div>
                            <div className="col-head display-flex device_action_dropdown_parent">
                                <div className="sts_icon" onClick={() => { handleactionclick(index) }}>
                                    <Icon icon={ic_label_important} style={{ transform: rotatedindex === index ? 'rotate(90deg)' : 'rotate(0)', color: rotatedindex === index ? '#08c6cd' : 'lightgray', }} className='device_content_arrow' size={25} />
                                </div>
                                <div key={index}>{(rotatedindex === index) &&
                                    (<div className='device_action_dropdown3'>
                                        <div className='display-flex device_action_dropdown1 dropdown_action' style={{ width: "100%" }} data-bs-toggle="modal" data-bs-target="#exampleModalCenter" onClick={() => { handlenotes(item) }}>
                                            <FontAwesomeIcon className='device_content_arrows' icon={faAnglesDown} size='lg' />
                                            <div className='device_content_dropdown display-flex' >Add Notes</div>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>

            </div>
            {/* bootsrap modal to add notes */}
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div className="alert_man_boot_header">
                            <h5>Add Action Taken</h5>
                        </div>
                        <div className="alert_man_boot_body">
                            <textarea className="alert_man_boot_text" onChange={(e) => { setnotes(e.target.value) }} value={notes}></textarea>
                        </div>
                        <div className="alert_man_boot_footer display-flex justify-end">
                            <div className='btn-loc active-loc display-flex' onClick={savedata} data-bs-dismiss={modal ? 'modal' : ''}>Save</div>
                            <div className='btn-loc inactive-loc display-flex' data-bs-dismiss="modal">Close</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Alert_Management;