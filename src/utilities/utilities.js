
import React from 'react';

export function formatCurrency(num) {
    if (num === 0 || num === undefined) {
        return <span style={{color:'lightgray'}}> -</span>;
    }
    else {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}

export function getGenres(genres) {
    var g = []
    Object.entries(genres).forEach((x) => {
        g.push(x[1].name)
    })

    return g;
}

export function getStream(streamValue) {
    switch(streamValue) {
        case "Netflix":
          return <img src="../img/Netflix.png" alt="Netflix" />
          break;
        default:
          // code block
      } 
}