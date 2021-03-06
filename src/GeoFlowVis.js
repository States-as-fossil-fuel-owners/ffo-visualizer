import { useD3 } from './hooks/useD3';
import React, { Fragment, useContext, useState } from 'react';
import * as d3 from 'd3';
import * as d3_geo from 'd3-geo-projection';
import { visualizeLinks } from './LinkVis';
import AppContext from './AppContext';
import { getLocationMap } from './DataStore';

function GeoFlowVis({ countryMap }) {
  const { filteredData } = useContext(AppContext);
  const [tooltipData, setTooltipData] = useState(null);

  const showTooltip = (event, data) => {
    setTooltipData(event.type === 'mouseout' ? null : {
      ...data,
      top: event.clientY + 16,
      left: event.clientX + 16});
  }

  const ref = useD3(
    (svg) => {
      console.log("RENDERING", filteredData);
      const projection = d3_geo.geoAitoff();
      const path = d3.geoPath(projection);

      // Clean up
      svg.selectAll(".link").remove();

      // Render base map
      svg
        .select(".map")
        .datum(countryMap)
        .attr("fill", "#b5b1a7")
        .attr("stroke", "white")
        .attr("stroke-width", 0.4)
        .attr("d", path);

      // Render links
      if (filteredData.links.length > 0) {
        visualizeLinks(filteredData, projection, svg, getLocationMap(), showTooltip);
      }
    },
  [filteredData]);

  return (
    <Fragment>
      <svg
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        viewBox={[160, 0, 800, 420]}>
        <path className="map" />
      </svg>
      <div className="tooltip" style={{
          top: tooltipData ? `${tooltipData.top}px` : 0,
          left: tooltipData ? `${tooltipData.left}px` : 0,
          visibility: tooltipData ? 'visible' : 'hidden'}}>
        Source: {tooltipData && tooltipData.sourceName}<br />
        Target: {tooltipData && tooltipData.targetName}<br />
        Weight: {tooltipData && tooltipData.weight}
      </div>
    </Fragment>
  );
}

export default GeoFlowVis;
