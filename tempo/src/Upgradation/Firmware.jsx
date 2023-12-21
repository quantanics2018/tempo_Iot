import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { faAnglesDown, faChevronDown, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'react-icons-kit';
import { ic_label_important } from 'react-icons-kit/md/ic_label_important';

function Firmware() {
    //states
    const [alldata, setalldata] = useState();
    const [alldevice_model, setalldevice_model] = useState();
    const [activecount, setactivecount] = useState();
    const [inactivecount, setinactivecount] = useState();
    const [selected_device_model, setselected_device_model] = useState();
    const [selected_device_status, setselected_device_status] = useState();


    //dropdown state
    const [dropdown1, setdropdown1] = useState(false);
    const [dropdown2, setdropdown2] = useState(false);
    const [dropdown3, setdropdown3] = useState(false);
    const [action_dropdown, setaction_dropdown] = useState(false);
    const [showaction, setshowaction] = useState(true);
    const [rotatedindex, setrotatedindex] = useState();


    //checkbox
    const [headercheckbox, setheadercheckbox] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState([]);


    const initializeCheckboxStates = () => {
        const initialState = new Array(alldata.length).fill(false);
        setCheckboxStates(initialState);
    };

    // Function to handle the click event of an individual checkbox
    const handleCheckboxClick = (index) => {
        const newCheckboxStates = [...checkboxStates];
        newCheckboxStates[index] = !newCheckboxStates[index];
        setCheckboxStates(newCheckboxStates);
    };

    // Initialize checkboxStates when alldata is available
    if (alldata && checkboxStates.length !== alldata.length) {
        initializeCheckboxStates();
    }




    //functions
    const fetchdata = async (option, index) => {
        try {
            const response1 = await fetch(`${API_URL}/user`);
            const data1 = await response1.json();

            const uniqueDevicemodel = [...new Set(data1.map(item => item.device_model))];
            setalldevice_model(uniqueDevicemodel)

            const count1 = data1.filter(item => item.device_status === 1).length;
            const count2 = data1.filter(item => item.device_status != 1).length;

            setactivecount(count1);
            setinactivecount(count2);

            let filteredData1;
            if (index === '0') {
                if (option === 'ALL') {
                    filteredData1 = data1;
                } else {
                    filteredData1 = data1.filter(item => item.device_model === option);
                }
            } else if (index === '1') {
                if (option === 'Active') {
                    filteredData1 = data1.filter(item => item.device_status === 1);
                } else if (option === 'InActive') {
                    filteredData1 = data1.filter(item => item.device_status === 0);
                } else {
                    filteredData1 = data1;
                }
            } else {
                filteredData1 = data1;
            }

            setalldata(filteredData1)

        } catch (error) {
            console.log(error)
        }
    }

    const save_event_data = async (data, events) => {
        try {
            const device_id = data.device_id;
            const body = { device_id, events }
            const response2 = await fetch(`${API_URL}/upgradation/firmware`, {
                method: "post",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(body)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const save_all_data = async (events) => {
        try {
            checkboxStates.forEach(async function (value, index) {
                if (value === true) {
                    const device_id = alldata[index].device_id;
                    const body = { device_id, events }
                    const response2 = await fetch(`${API_URL}/upgradation/firmware`, {
                        method: "post",
                        headers: { "content-Type": "application/json" },
                        body: JSON.stringify(body)
                    })
                } else {
                    // console.log("The value at index " + index + " is false.");
                }
            });
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
        setdropdown3(!dropdown3);
    }
    //action icon onclick function
    const handleactionclick = async (index) => {
        if (rotatedindex === index) {
            setrotatedindex(null);
        } else {
            setrotatedindex(index);
        }
    }


    //filter functions
    const device_model_filter = (data) => {
        if (data === selected_device_model) {
            setselected_device_model('All');
            total_filter('All', '0');
        } else {
            setselected_device_model(data);
            total_filter(data, '0');
        }
    }

    const device_status_filter = (data) => {
        if (data === selected_device_status) {
            setselected_device_status('All');
            total_filter('All', '1');
        } else {
            setselected_device_status(data);
            total_filter(data, '1');
        }
    }

    const total_filter = (data, index) => {
        fetchdata(data, index)
    }



    //useeffects
    useEffect(() => {
        fetchdata()
    }, [])

    return (
        <div>
            <div className='status-bar'>
                <div className="device_mangement_main_content">
                    <div className="row_with_count_status">
                        <span className='module_tittle'>Firmware Upgradation</span>
                        <div className='status-btns display-flex'>
                            <div className='btn-loc active-loc display-flex '> <div style={{ fontSize: "20px" }}>{activecount}</div>Active</div>
                            <div className='btn-loc inactive-loc display-flex'><div style={{ fontSize: "20px" }}>{inactivecount}</div> Inactive</div>
                        </div>
                    </div>

                    <div className='filters display-flex' >
                        <div className="pagination_with_filters">
                            <div class="pagination display-flex">
                                <div className="focus-page">
                                    <input
                                        type="number"
                                        value='1'
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
                                                Device Model
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
                                                {alldevice_model.map((data, index) => (
                                                    <div className='device_scroll' key={index}>
                                                        <div>
                                                            <div className='device_dropdown'>
                                                                <input
                                                                    className='device_sts_checkbox'
                                                                    type="checkbox"
                                                                    checked={data === selected_device_model}
                                                                    onChange={() => device_model_filter(data)}
                                                                />
                                                                <div className="div_sts">{data}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='device_dropdown'>
                                                    <input className='device_sts_checkbox' type="checkbox"
                                                        checked={'ALL' === selected_device_model}
                                                        onChange={() => device_model_filter('ALL')}
                                                    />
                                                    <div className="div_sts">ALL</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div class="dropdown-filter" >
                                        <div class="device_filters" onClick={handledropdown2}>
                                            <div className="device_name">
                                                Device Status
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
                                                            checked={selected_device_status === 'All'}
                                                            onChange={() => device_status_filter('All')}
                                                        />
                                                        <div className="div_sts">All</div>
                                                    </div>
                                                    <div className='device_dropdown'>
                                                        <input
                                                            className='device_sts_checkbox'
                                                            type="checkbox"
                                                            checked={selected_device_status === 'Active'}
                                                            onChange={() => device_status_filter('Active')}
                                                        />
                                                        <div className="div_sts">Active</div>
                                                    </div>
                                                    <div className='device_dropdown'>
                                                        <input
                                                            className='device_sts_checkbox'
                                                            type="checkbox"
                                                            checked={selected_device_status === 'InActive'}
                                                            onChange={() => device_status_filter('InActive')}
                                                        />
                                                        <div className="div_sts">InActive</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="display-flex justify-end" style={{ width: "100%" }}>
                            {action_dropdown ? (
                                <div class="dropdown-filter" >
                                    <div class="device_filters" onClick={handledropdown3}>
                                        <div className="device_name">
                                            Action
                                        </div>
                                        <div className="dropdown_icon">
                                            <FontAwesomeIcon
                                                icon={faChevronDown}
                                                className="dropdown-icon"
                                            />
                                        </div>
                                    </div>
                                    {dropdown3 && (
                                        <div className="dropdown_menu2 dashboard_dropdown-menu dropdown-colors">
                                            <div style={{ cursor: "pointer" }}>
                                                <div className='device_dropdown' onClick={() => { save_all_data('reboot') }}>
                                                    <div className="div_sts">Reboot</div>
                                                </div>
                                                <div className='device_dropdown' onClick={() => { save_all_data('reset') }}>
                                                    <div className="div_sts">Reset To Factory</div>
                                                </div>
                                                <div className='device_dropdown' onClick={() => { save_all_data('fmupdate') }}>
                                                    <div className="div_sts">Upgrade Firmware</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>) : (<></>)}
                        </div>

                    </div>

                    <div className='col-headings'>
                        <div className="col-head">
                            <input type="checkbox"
                                checked={headercheckbox}
                                onChange={() => {
                                    const newCheckboxStates = checkboxStates.map(() => !checkboxStates.every((state) => state));
                                    setCheckboxStates(newCheckboxStates);
                                    setaction_dropdown(!action_dropdown);
                                    setheadercheckbox(!headercheckbox)
                                    setshowaction(!showaction)
                                }}
                                style={{ width: "28%", height: "50%", marginRight: "5px" }}></input>Device Id
                        </div>
                        <div className="col-head">Device Name</div>
                        <div className="col-head">Device Model</div>
                        <div className="col-head">Device installed on</div>
                        <div className="col-head">Device installed by</div>
                        <div className="col-head">Device status</div>
                        {showaction ? (<div className="col-head">Device action</div>) : (<></>)}
                    </div>

                    <div className="scroll_div">
                        {alldata ? (alldata.map((item, index) => (
                            <div className="datas skeleton-block" key={index}>
                                <div className="col-head" >
                                    <input type="checkbox" checked={checkboxStates[index]}
                                        onChange={() => handleCheckboxClick(index)}
                                        style={{ width: "28%", height: "50%", marginRight: "5px" }}></input>{item.device_id}
                                </div>
                                <div className="col-head" >{item.device_name}</div>
                                <div className="col-head" >{item.device_model}</div>
                                <div className="col-head" >{item.last_updated_on.split('T')[0]}</div>
                                <div className="col-head">admin</div>

                                <div className="col-head display-flex">
                                    <FontAwesomeIcon icon={faDiamond} style={{ color: 'green', paddingTop: '7px' }} size="xs" />
                                    <div className={`device_active`} style={{ color: 'green' }}>{'Active'}</div>
                                </div>
                                {showaction ? (
                                    <div className="col-head display-flex device_action_dropdown_parent">
                                        <div className="sts_icon" onClick={() => { handleactionclick(index) }}>
                                            <Icon icon={ic_label_important} style={{ transform: rotatedindex === index ? 'rotate(90deg)' : 'rotate(0)', color: rotatedindex === index ? '#08c6cd' : 'lightgray', }} className='device_content_arrow' size={25} />
                                        </div>
                                        <div key={index}> {(rotatedindex === index) &&
                                            (<div className='device_action_dropdown'>
                                                <div className='display-flex device_action_dropdown1 dropdown_action' onClick={() => { save_event_data(item, 'reboot') }}>
                                                    <FontAwesomeIcon className='device_content_arrows' icon={faAnglesDown} size='lg' />
                                                    <div className='device_content_dropdown display-flex' >Reboot</div>
                                                </div>
                                                <div className='display-flex device_action_dropdown2 dropdown_action' onClick={() => { save_event_data(item, 'reset') }}>
                                                    <FontAwesomeIcon icon={faAnglesDown} className='device_content_arrows' size='lg' />
                                                    <div className='device_content_dropdown display-flex' >Reset to Factory</div>
                                                </div>
                                                <div className='display-flex device_action_dropdown2 dropdown_action' onClick={() => { save_event_data(item, 'fmupdate') }}>
                                                    <FontAwesomeIcon icon={faAnglesDown} className='device_content_arrows' size='lg' />
                                                    <div className='device_content_dropdown display-flex' >Upgrade Firmware</div>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                ) : (<></>)}
                            </div>
                        ))) : (
                            <p>Loading...</p>
                        )}


                    </div>
                    <div className='device_bottom'>
                        <div className='device_export cursor-pointer'>
                            <div className='device_exports'>Export</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* bootstrap modal */}
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="firmware-boot-header">
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#0b5dea", fontSize: "80px" }} />
                        </div>
                        <div class="firmware-boot-body">
                            Device has been Rebooted Successfully
                        </div>
                        <div class="firmware-boot-footer">
                            <button type="button" className="btn-loc active-loc" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="firmware-boot-header">
                            <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "#ffd43b", fontSize: "80px" }} />
                        </div>
                        <div class="firmware-boot-body">
                            Failed
                        </div>
                        <div class="firmware-boot-footer">
                            <button type="button" className="btn-loc active-loc" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Firmware;