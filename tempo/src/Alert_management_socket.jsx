import React, { useEffect, useRef } from "react";
import { API_URL } from "./config";
import { io } from "socket.io-client";

function Alert_management_socket() {

    const alldata = useRef();

    var device_name_check = [];
    var alert_type_check = [];
    var alert_category_check = [];

    const fetchalert_configuration_data = async () => {
        try {
            const response1 = await fetch(`${API_URL}/configuration/alert`)
            const filteredData = await response1.json();
            const data = filteredData.filter(item => item.status === 1);

            alldata.current = data;
        } catch (error) {
            console.log(error)
        }
    }
    const find_alert = (data) => {

        if (alldata.current) {

            alldata.current.map((item, index) => {
                if (!device_name_check.includes(item.device_name) || !alert_type_check.some(obj => obj[item.device_name] === item.parameters) || !alert_category_check.some(obj => obj[item.parameters] === item.alert_category)) {
                    for (const key in data) {
                        if (item.device_mac_address === key) {
                            const parameters = item.parameters;
                            const condition = `${item.value} ${item.boundary} ${data[key][parameters][0].value}`;
                            if (eval(condition)) {
                                console.log("condition")
                            }
                            else {
                                console.log("satisfied")
                                device_name_check.push(item.device_name)
                                alert_type_check.push({ [item.device_name]: parameters });
                                alert_category_check.push({ [parameters]: item.alert_category });
                                savedata(item.device_name, item.device_id, data[key][parameters][0].value, parameters, data[key].dt, item.alert_category);
                            }
                        }
                    }
                }
                else {
                    console.log("here")
                }
            })
        }
    }
    const savedata = async (device_name, device_id, value, alert_type, timestamp, alert_category) => {
        try {
            const body = { device_name, device_id, value, alert_type, timestamp, alert_category }
            const response2 = await fetch(`${API_URL}/management/alert_management`, {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(body)
            })
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        const socket = io('http://localhost:5000/');
        socket.on('change_alert', (data) => {
            find_alert(data)
        });

        return () => {
            socket.off('change_alert');
        };
    }, []);

    const clearArrays = () => {
        device_name_check = [];
        alert_type_check = [];
        alert_category_check = [];
    };
    useEffect(() => {
        const intervalId = setInterval(clearArrays, 3600000);
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        fetchalert_configuration_data();
    }, [])



}

export default Alert_management_socket;