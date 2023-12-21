import React, { useState, useEffect, useRef } from "react";
import { Icon } from 'react-icons-kit';
import { ic_label_important } from 'react-icons-kit/md/ic_label_important';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config';

function AlertSetting() {

    // add alert data management state
    const [alert_name, setalert_name] = useState();
    const [alert_category, setalertcategory] = useState();
    const [alert_category_id, setalertcategory_id] = useState();
    const [device_id, setdevice_id] = useState();
    const [device_name, setdevice_name] = useState();
    const [parameter, setparameter] = useState();
    const [boundary_id, setboundary_id] = useState();
    const [boundary, setboundary] = useState();
    const [values, setvalues] = useState();
    const [notes, setnotes] = useState();
    const [total_alert_category, settotal_alert_category] = useState([]);
    const [total_device, settotal_device] = useState();
    const [total_parameter, settotal_parameter] = useState();
    const [total_boundary, settotal_boundary] = useState();
    const [cautioncount, setcautioncount] = useState(0);
    const [criticalcount, setcriticalcount] = useState(0);
    const [totalcount, settotalcount] = useState(0);

    //edit alert data management state
    const [edit_alert_id, setedit_alert_id] = useState();
    const [edit_alert_name, setedit_alert_name] = useState();
    const [edit_alert_category, setedit_alertcategory] = useState();
    const [edit_alertcategory_id, setedit_alertcategory_id] = useState();
    const [edit_device_name, setedit_device_name] = useState();
    const [edit_parameter, setedit_parameter] = useState();
    const [edit_boundary_id, setedit_boundary_id] = useState();
    const [edit_boundary, setedit_boundary] = useState();
    const [edit_values, setedit_values] = useState();
    const [edit_notes, setedit_notes] = useState();

    //alldatastate
    const [alldata, setalldata] = useState();

    //dropdown management state
    const [dropdown1, setdropdown1] = useState(false)
    const [dropdown2, setdropdown2] = useState(false)
    const [dropdown3, setdropdown3] = useState(false)
    const [dropdown4, setdropdown4] = useState(false)
    const [dropdown5, setdropdown5] = useState(false);
    const [dropdown6, setdropdown6] = useState(false);
    const [rotatedindex, setrotatedindex] = useState();

    //dropdown data state
    const [dropdown_device_id, setdropdown_device_id] = useState()
    const [dropdown_alert_category, setdropdown_alert_category] = useState()

    //bootstrap modal state
    const [modal, setmodal] = useState(true);

    //filter state
    const [selected_device_id, setselected_device_id] = useState();
    const [selected_alert_category, setselected_alert_category] = useState();

    //useref
    const dropdownref1 = useRef(null)
    const dropdownref2 = useRef(null)



    // functions
    const fetchbasedata = async () => {
        try {
            const response1 = await fetch(`${API_URL}/alert_category`);
            const alertcategory = await response1.json();
            settotal_alert_category(alertcategory);


            const response2 = await fetch(`${API_URL}/alert_boundary`);
            const alertboundary = await response2.json();
            settotal_boundary(alertboundary)

            const response3 = await fetch(`${API_URL}/user`)
            const totaldevice = await response3.json();
            settotal_device(totaldevice)

        } catch (error) {
            console.log("error")
        }
    }


    const savedata = async () => {
        try {
            const body = { alert_name, alert_category_id, device_id, parameter, boundary_id, values, notes }
            const response5 = await fetch(`${API_URL}/configuration/alert`, {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            if (response5) {
                fetchdata();
                setmodal(true);
            }
        } catch (error) {
            console.log(error)
        }
    }


    const fetchdata = async (option,index) => {
        try {
            const response6 = await fetch(`${API_URL}/configuration/alert`)
            const filteredData = await response6.json();

            const data = filteredData.filter(item => item.status === 1);
            settotalcount(data.length)

            const uniqueDeviceIds = [...new Set(data.map(item => item.device_id))];
            const uniqueAlertCategories = [...new Set(data.map(item => item.alert_category))];

            setdropdown_device_id(uniqueDeviceIds);
            setdropdown_alert_category(uniqueAlertCategories);

            const count1 = data.filter(item => item.alert_category_id === 'ASI1');
            const count2 = data.filter(item => item.alert_category_id === 'ASI2');

            setcautioncount(count1.length);
            setcriticalcount(count2.length);

            let filteredData1;
            if(index==='0'){
                if(option === 'ALL'){
                    filteredData1=data;
                }else{
                    filteredData1 = data.filter(item => item.device_id === option);
                }
            }else if(index === '1'){
                if(option === 'ALL'){
                    filteredData1=data;
                }
                else{
                    filteredData1 = data.filter(item  =>item.alert_category === option)
                }
            }
            else{
                filteredData1=data;
            }

            setalldata(filteredData1)
        } catch (error) {
            console.log(error)
        }
    }


    const dropalert = async (data) => {
        try {
            const confirmation = window.confirm("Do You want to drop this alert?")
            if (confirmation) {
                var alert_id = data;
                var status = 0;
                const body = { alert_id, status };
                const response7 = await fetch(`${API_URL}/configuration/dropalert`, {
                    method: "PUT",
                    headers: { "content-Type": "application/json" },
                    body: JSON.stringify(body)
                })
                if (response7) {
                    fetchdata()
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    const geteditdetails_data = async (data) => {
        const selected = alldata.find(item => item.alert_id === data);
        if (selected) {
            setedit_alert_id(selected.alert_id)
            setedit_alert_name(selected.alert_name);
            setedit_alertcategory_id(selected.alert_category_id)
            setedit_alertcategory(selected.alert_category)
            setedit_boundary_id(selected.boundary_id)
            setedit_boundary(selected.boundary)
            setedit_values(selected.value)
            setedit_notes(selected.notes)
            setedit_parameter(selected.parameters)
            setedit_device_name(selected.device_name)
        }
    }


    const save_editdetails_data = async () => {
        try {
            const body = { edit_alert_id, edit_alert_name, edit_alertcategory_id, edit_boundary_id, edit_values, edit_notes }
            const response8 = await fetch(`${API_URL}/configuration/alert`, {
                method: "PUT",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            if (response8) {
                fetchdata()
                setmodal(true)
            }

        } catch (error) {
            console.log(error)
        }
    }



    // dropdown functions
    const handledropdown1 = () => {
        if (device_id !== undefined && device_id !== null) {
            setdropdown1(!dropdown1)
        }
    }
    const handledropdown2 = () => {
        setdropdown2(!dropdown2)
    }
    const handledropdown3 = () => {
        setdropdown3(!dropdown3)
    }
    const handledropdown4 = () => {
        setdropdown4(!dropdown4)
    }
    const handledropdown5 = () => {
        setdropdown5(!dropdown5)
    }
    const handledropdown6 = () => {
        setdropdown6(!dropdown6)
    }


    // value add alert onclick function
    const handledevice_values = async (data) => {
        setdevice_id(data.device_id)
        setdevice_name(data.device_name)
        try {
            const response4 = await fetch(`${API_URL}/individual_parameter/${data.device_id}`)
            const deviceparameter1 = await response4.json();
            const deviceparameter = deviceparameter1[0].device_parameters;

            const parameterValuePairs = deviceparameter.split("&&");
            const jsonArray = [];
            parameterValuePairs.forEach(pair => {
                const [parameter] = pair.split("&");
                const jsonObject = { parameter };
                jsonArray.push(jsonObject);
            });
            settotal_parameter(jsonArray)
            setdropdown4(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handlealert_category = (data) => {
        setalertcategory_id(data.alert_setting_id)
        setalertcategory(data.alert_category)
        setdropdown2(false);
    }
    const handleboundary = (data) => {
        setboundary_id(data.boundary_id)
        setboundary(data.boundary)
        setdropdown3(false);
    }
    const handleparameter = (data) => {
        setparameter(data.parameter)
        setdropdown1(false);
    }

    // edit alert onclick function
    const handleedit_boundary = async (data) => {
        setedit_boundary(data.boundary)
        setedit_boundary_id(data.boundary_id)
        setdropdown3(false)
    }
    const handleeditalert_category = async (data) => {
        setedit_alertcategory_id(data.alert_setting_id)
        setedit_alertcategory(data.alert_category)
        setdropdown2(false)
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
    const device_id_filter = (data) => {
        if (data === selected_device_id) {
            setselected_device_id('All');
            total_filter('All', '0');
        } else {
            setselected_device_id(data);
            total_filter(data, '0');
        }
    }

    const alert_category_filter = (data) => {
        if (data === selected_alert_category) {
            setselected_alert_category('All');
            total_filter('All', '1');
        } else {
            setselected_alert_category(data);
            total_filter(data, '1');
        }
    }

    const total_filter = (data,index) => {
        fetchdata(data,index)
    }



    // useeffects
    useEffect(() => {
        fetchdata();
        fetchbasedata();
    }, [])


    //userefs
    const empty_space_down1 = (event) => {
        if (!dropdownref1.current.contains(event.target)) {
            setdropdown5(false)
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
            setdropdown6(false)
        }
    };
    useEffect(() => {
        document.addEventListener('click', empty_space_down2);
        return () => {
            document.removeEventListener('click', empty_space_down2);
        };
    }, []);


    return (
        <>
            <div className="row_with_count_status">
                <span className='module_tittle'>Alert</span>
                <div className='status-btns display-flex'>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "#00B0F0" }}><div style={{ fontSize: "20px", paddingRight: "3px" }}>{totalcount}</div> Total</div>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "green" }}><div style={{ fontSize: "20px", paddingRight: "3px" }}>{cautioncount}</div>  Caution</div>
                    <div className='btn-loc alert_configutation_top_btn display-flex' style={{ color: "red" }}> <div style={{ fontSize: "20px", paddingRight: "3px" }}>{criticalcount}</div> Critical</div>
                </div>
            </div>
            <div className='filters display-flex' >
                <div className="pagination_with_filters">
                    <div class="pagination display-flex" >
                        <div className="focus-page">
                            <input
                                type="number"
                                value="1"
                                autoFocus
                                className='editable_input_box'
                            />

                        </div>
                        <div className="upcomming-pages">
                            of 20 pages
                        </div>
                    </div>

                    <div className='move_head'>
                        <div className='filters1 display-flex'>
                            <div class="dropdown-filter" ref={dropdownref1}>
                                <div class="device_filters" onClick={handledropdown5}>
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
                                {dropdown5 && (
                                    <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                                        {dropdown_device_id.map((data, index) => (
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
                            <div class="dropdown-filter" ref={dropdownref2}>
                                <div class="device_filters" onClick={handledropdown6}>
                                    <div className="device_name">
                                        Alert Category
                                    </div>
                                    <div className="dropdown_icon">
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="dropdown-icon"
                                        />
                                    </div>
                                </div>
                                {dropdown6 && (
                                    <div className="dropdown_menu2 dashboard_dropdown-menu heights dropdown-colors ">
                                        {dropdown_alert_category.map((data, index) => (
                                            <div className='device_scroll' key={index}>
                                                <div>
                                                    <div className='device_dropdown'>
                                                        <input
                                                            className='device_sts_checkbox'
                                                            type="checkbox"
                                                            checked={data === selected_alert_category}
                                                            onChange={() => alert_category_filter(data)}
                                                        />
                                                        <div className="div_sts">{data}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className='device_dropdown'>
                                            <input className='device_sts_checkbox' type="checkbox"
                                            checked={selected_alert_category === 'ALL'}
                                            onChange={() => alert_category_filter('ALL')} 
                                            />
                                            <div className="div_sts">ALL</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='filters2 display-flex' >
                    <button className='btn btn-fill' data-bs-toggle="modal" data-bs-target="#device_status_action">Add Alert</button>
                </div>
            </div>
            <div className="row_with_column_headings">
                <div className="col-head uppercase">Alert ID</div>
                <div className="col-head uppercase">Device Name</div>
                <div className="col-head uppercase">Device Model</div>
                <div className="col-head uppercase">Device ID</div>
                <div className="col-head uppercase">Value</div>
                <div className="col-head uppercase">alert type</div>
                <div className="col-head uppercase">updated by</div>
                <div className="col-head uppercase">alert category</div>
                <div className="col-head uppercase">Action</div>
            </div>
            <div className="scroll_div" style={{ overflowY: "auto" }}>
                {alldata ? (alldata.map((item, index) => (
                    <div className="datas skeleton-block" key={index}>
                        <div className="col-head" >{item.alert_id}</div>
                        <div className="col-head" >{item.device_name}</div>
                        <div className="col-head" >{item.device_model}</div>
                        <div className="col-head" >{item.device_id}</div>
                        <div className="col-head" >{item.value}c</div>
                        <div className="col-head" >{item.parameters}</div>
                        <div className="col-head" >Admin</div>
                        <div className="col-head" >
                            <div className={`alert_configuration_${item.alert_category} display-flex justify-align`}> {item.alert_category} </div>
                        </div>
                        <div className="col-head display-flex device_action_dropdown_parent">
                            <div className="sts_icon" onClick={() => { handleactionclick(index) }}>
                                <Icon icon={ic_label_important} style={{ transform: rotatedindex === index ? 'rotate(90deg)' : 'rotate(0)', color: rotatedindex === index ? '#08c6cd' : 'lightgray', }} className='device_content_arrow' size={25} />
                            </div>
                            <div key={index}>{(rotatedindex === index && item.status === 1) &&
                                (<div className='device_action_dropdown'>
                                    <div className='display-flex device_action_dropdown1 dropdown_action' data-bs-toggle="modal" data-bs-target="#device_status_action_details" onClick={() => { geteditdetails_data(item.alert_id) }}>
                                        <FontAwesomeIcon className='device_content_arrows' icon={faAnglesDown} size='lg' />
                                        <div className='device_content_dropdown display-flex' >Edit Detials</div>
                                    </div>
                                    <div className='display-flex device_action_dropdown2 dropdown_action' onClick={() => { dropalert(item.alert_id) }}>
                                        <FontAwesomeIcon icon={faAnglesDown} className='device_content_arrows' size='lg' />
                                        <div className='device_content_dropdown display-flex' >Drop Alert</div>
                                    </div>
                                </div>)}
                            </div>
                            <div key={index}>{(rotatedindex === index && item.status === 0) &&
                                (<div className='device_action_dropdown'>
                                    <div className='display-flex device_action_dropdown1 dropdown_action'>
                                        <FontAwesomeIcon className='device_content_arrows' icon={faAnglesDown} size='lg' />
                                        <div className='device_content_dropdown display-flex'>Device Details</div>

                                    </div>
                                    <div className='display-flex device_action_dropdown2 dropdown_action'>
                                        <FontAwesomeIcon icon={faAnglesDown} className='device_content_arrows' size='lg' />
                                        <div className='device_content_dropdown display-flex' >Activate Device</div>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                ))) : (
                    <p>Loading...</p>
                )}
            </div>



            {/* bootstrpa modal */}

            {/* add alert configuration */}
            <div class="modal fade device_status_action" id="device_status_action" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div class="modal-dialog" >
                    <div class="modal-content" style={{ gap: "3rem" }}>
                        <div class="device_status_header">
                            <h5 class="modal-title" id="exampleModalLabel">ADD ALERT DETAILS
                            </h5>
                        </div>
                        <div class="device_status_body" style={{ gap: "1.5rem" }}>
                            <div className="dsa_row1" style={{ width: "100%" }}>
                                <div className="dsa_1st_input" style={{ width: "50%" }}>
                                    <label for="input1">Alert Name</label>
                                    <div className="inputs-group">
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" id="input1" onChange={(e) => { setalert_name(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="dsa_1st_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Select Parameter</label>
                                    <div className="inputs-group cursor-pointer" onClick={handledropdown1}>
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc cursor-pointer" id="input1" readOnly value={parameter} />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                    {dropdown1 && (
                                        <div className="position-a config_alert_dropdown cursor-pointer">
                                            {total_parameter.map((item, index) => (
                                                <div key={index} className="alert_dropdown_top">
                                                    <div className="dropdown_list" onClick={() => { handleparameter(item) }}>
                                                        {item.parameter}
                                                    </div>
                                                    {index !== total_parameter.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="dsa_row2" style={{ width: "100%" }}>
                                <div className="dsa_2nd_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Alert Category</label>
                                    <div className="inputs-group cursor-pointer" onClick={handledropdown2}>
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc cursor-pointer" id="input1" value={alert_category} readOnly />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                    {dropdown2 && (
                                        <div className="position-a config_alert_dropdown cursor-pointer">
                                            {total_alert_category.map((item, index) => (
                                                <div key={index} className="alert_dropdown_top">
                                                    <div className="dropdown_list" onClick={() => { handlealert_category(item) }}>
                                                        {item.alert_category}
                                                    </div>
                                                    {index !== total_alert_category.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="display-flex" style={{ width: "50%" }}>
                                    <div className="display-flex display-flex-c position-r" style={{ width: "50%" }}>
                                        <label for="input1">Boundary</label>
                                        <div className="inputs-group cursor-pointer" onClick={handledropdown3}>
                                            <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                            <input type="text" class="form-control-loc cursor-pointer" id="input1" readOnly value={boundary} />
                                            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                        </div>
                                        {dropdown3 && (
                                            <div className="position-a config_alert_dropdown cursor-pointer">
                                                {total_boundary.map((item, index) => (
                                                    <div key={index} className="alert_dropdown_top">
                                                        <div className="dropdown_list" onClick={() => { handleboundary(item) }}>
                                                            {item.boundary}
                                                        </div>
                                                        {index !== total_boundary.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div><span style={{ width: "10%" }}></span>
                                    <div className="display-flex  display-flex-c " style={{ width: "40%" }}>
                                        <label for="input1" >value</label>
                                        <div className="inputs-group">
                                            <input type="text" class="form-control-loc" style={{ height: "40px" }} id="input1" onChange={(e) => { setvalues(e.target.value) }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dsa_row3" style={{ width: "100%" }}>
                                <div className="dsa_3rd_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Select Device</label>
                                    <div className="inputs-group  cursor-pointer" onClick={handledropdown4}>
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc cursor-pointer" id="input1" readOnly value={device_name} />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                    {dropdown4 && (
                                        <div className="position-a config_alert_dropdown cursor-pointer">
                                            {total_device.map((item, index) => (
                                                <div key={index} className="alert_dropdown_top">
                                                    <div className="dropdown_list" onClick={() => { handledevice_values(item) }}>
                                                        {item.device_name}
                                                    </div>
                                                    {index !== total_device.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="dsa_3rd_input" style={{ width: "50%" }}>
                                    <label for="input1">Note</label>
                                    <div className="inputs-group">
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" id='input1' onChange={(e) => { setnotes(e.target.value) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="device_status_footer">
                            <button type="button" class="btn-loc active-loc" onClick={savedata} data-bs-dismiss={modal ? 'modal' : ''}>Save</button>
                            <button type="button" class="btn-loc inactive-loc" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* edit alert bootstrap modal */}
            <div class="modal fade device_status_action" id="device_status_action_details" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="device_status_header">
                            <h5 class="modal-title" id="exampleModalLabel">EDIT ALERT DETAILS
                            </h5>
                            {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                        </div>
                        <div class="device_status_body" style={{ gap: "1.5rem" }}>
                            <div className="dsa_row1" style={{ width: "100%" }}>
                                <div className="dsa_1st_input" style={{ width: "50%" }}>
                                    <label for="input1">Alert Name</label>
                                    <div className="inputs-group">
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" id="input1" value={edit_alert_name} onChange={(e) => { setedit_alert_name(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="dsa_1st_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Select Parameter</label>
                                    <div className="inputs-group" style={{cursor:"no-drop"}} >
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" style={{cursor:"no-drop"}} id="input1" readOnly value={edit_parameter} />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                </div>
                            </div>

                            <div className="dsa_row2" style={{ width: "100%" }}>
                                <div className="dsa_2nd_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Alert Category</label>
                                    <div className="inputs-group cursor-pointer" onClick={handledropdown2}>
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc cursor-pointer" id="input1" value={edit_alert_category} readOnly />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                    {dropdown2 && (
                                        <div className="position-a config_alert_dropdown cursor-pointer">
                                            {total_alert_category.map((item, index) => (
                                                <div key={index} className="alert_dropdown_top">
                                                    <div className="dropdown_list" onClick={() => { handleeditalert_category(item) }}>
                                                        {item.alert_category}
                                                    </div>
                                                    {index !== total_alert_category.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="display-flex" style={{ width: "50%" }}>
                                    <div className="display-flex display-flex-c position-r" style={{ width: "50%" }}>
                                        <label for="input1">Boundary</label>
                                        <div className="inputs-group cursor-pointer" onClick={handledropdown3}>
                                            <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                            <input type="text" class="form-control-loc cursor-pointer" id="input1" readOnly value={edit_boundary} />
                                            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                        </div>
                                        {dropdown3 && (
                                            <div className="position-a config_alert_dropdown cursor-pointer">
                                                {total_boundary.map((item, index) => (
                                                    <div key={index} className="alert_dropdown_top">
                                                        <div className="dropdown_list" onClick={() => { handleedit_boundary(item) }}>
                                                            {item.boundary}
                                                        </div>
                                                        {index !== total_boundary.length - 1 && <hr className='hrs' style={{ width: "100%" }}></hr>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div><span style={{ width: "10%" }}></span>
                                    <div className="display-flex  display-flex-c " style={{ width: "40%" }}>
                                        <label for="input1" >value</label>
                                        <div className="inputs-group">
                                            <input type="text" class="form-control-loc" style={{ height: "40px" }} id="input1" value={edit_values} onChange={(e) => { setedit_values(e.target.value) }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dsa_row3" style={{ width: "100%" }}>
                                <div className="dsa_3rd_input position-r" style={{ width: "50%" }}>
                                    <label for="input1">Select Device</label>
                                    <div className="inputs-group  " style={{cursor:"no-drop"}}>
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" style={{cursor:"no-drop"}} id="input1" readOnly value={edit_device_name} />
                                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" style={{ position: "relative", top: "10px", right: "19px" }} />
                                    </div>
                                </div>
                                <div className="dsa_3rd_input" style={{ width: "50%" }}>
                                    <label for="input1">Note</label>
                                    <div className="inputs-group">
                                        <span class="input-group-loc"><Icon icon={ic_label_important} size={20} style={{ color: "lightgray" }} /></span>
                                        <input type="text" class="form-control-loc" id='input1' value={edit_notes} onChange={(e) => { setedit_notes(e.target.value) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="device_status_footer">
                            <button type="button" class="btn-loc active-loc" data-bs-dismiss={modal ? 'modal' : ''} onClick={save_editdetails_data}>Save</button>
                            <button type="button" class="btn-loc inactive-loc" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AlertSetting;