import React from 'react';
import PropTypes from "prop-types";

export default function Timer(props) {
    const {
        date,
    } = props;

    const [time, setTime] = React.useState('');

     const updateTimer = () => {
        const end = new Date(date).getTime();
        const now = new Date().getTime();
        
        const distance = end - now;

        if(distance <= 0) {
            setTime(`0h 0m 0s`);
            return;
        }
        
        // Time calculations for hours, minutes and seconds
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
        setTime(`${hours}h ${minutes}m ${seconds}s`);
    }

    React.useEffect(() => {
        setInterval(() => updateTimer(), 1000)
    }, [])

    return (
        <>
            {time}
        </>
    )
}

Timer.propTypes = {
    date: PropTypes.string
  };