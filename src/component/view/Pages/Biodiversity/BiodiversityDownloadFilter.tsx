import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { CardComponent } from '../../../common/cardComponent';
import SelectComponent from '../../../common/selectComponent';
import DownloadCardComponent from '../../../common/downloadCardComponent';
import ProjectListData from '../../../../db.json';
import { AudioSpecies, ImageSpecies, SensorOption,SpeciesData } from '../../../../Interface/Index';

const BiodiversityDownloadFilter = () => {
  const [loader ] = useState(false);
  const [cardTitle, setCardTitle] = useState('Species Data');
  const [data, setData] = useState<SpeciesData[]>([]); // Holds the filtered or all data
  const [allData, setAllData] = useState<SpeciesData[]>([]); // Holds all data for reset
  const [projectSite ] = useState(ProjectListData.ProjectSite);

  const [selectedYear, setSelectedYear]= useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const [speciesOptions, setSpeciesOptions] = useState<SensorOption[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [monthOptions, setMonthOptions] = useState<string[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string[]>([]);
  const [sensorOptions, setSensorOptions] = useState<SensorOption[]>([]);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);

  useEffect(() => {
    if (allData.length) {
      setCheckboxStates(new Array(allData.length).fill(false));
    }
  }, [allData]);
  const siteDetails = JSON.parse(
    localStorage.getItem("SelectedDropDownSite") || "[]"
  );

  useEffect(() => {
    const filterSpeciesData = projectSite?.[0]?.[0]?.sites?.some(
      (site:  { site_name: string }) => site.site_name === siteDetails?.site_name
    )
      ? siteDetails?.species_detected
      : "";
    if (filterSpeciesData?.length) {
      const years = Object.keys(filterSpeciesData[0]);
      setYearOptions(years);

      const yearData = filterSpeciesData[0][years[0]];
      const getBaseURL = yearData.base_url;
      const getCamDir = yearData.img_dir;
      const getAudDir = yearData.audio_dir;
      const initialData = [
        ...yearData.image_species.map((item: ImageSpecies) => ({
          id: item.camera_id,
          type: item.Type,
          date: item.Date,
          score: item.Confidence_Score,
          name: item.Name,
          url: item.camera_id
            ? `${getBaseURL}/${getCamDir}/${item.camera_id}/${item.Type}/${item.Name}`
            : null,
        })),
        ...yearData.audio_species.map((item:AudioSpecies) => ({
          id: item.audiomoth_id,
          type: item.Type,
          date: item.Date,
          score: item.Confidence_Score,
          name: item.Name,
          url: item.audiomoth_id
            ? `${getBaseURL}/${getAudDir}/${item.audiomoth_id}/${item.Name}`
            : null,
        })),
      ];
      setData(initialData);
      setAllData(initialData);
    }
  }, [projectSite]);

  const handleYearChange = (event: SelectChangeEvent) => {
    const year = event.target.value;
    setSelectedYear(year);

    if (year) {
      const filterSpeciesData = siteDetails?.species_detected;
      const yearData = filterSpeciesData[0][year];
      const getBaseURL = yearData.base_url;
      const getCamDir = yearData.img_dir;
      const getAudDir = yearData.audio_dir;

      const availableMonths = Array.from(
        new Set([
          ...yearData.image_species.map((item: ImageSpecies) => item.Date.split('-')[1]),
          ...yearData.audio_species.map((item: AudioSpecies) => item.Date.split('-')[1]),
        ])
      )
        .sort() // Sort to ensure months are in order
        .map((monthNum: string) =>
          new Date(2024, parseInt(monthNum, 10) - 1).toLocaleString("default", {
            month: "long",
          })
        );

      setMonthOptions(availableMonths);
    
      const sensors = [
        ...yearData.image_species.map((item: ImageSpecies) => ({
          id: item.camera_id,
          type: "Camera",
        })),
        ...yearData.audio_species.map((item: AudioSpecies) => ({
          id: item.audiomoth_id,
          type: "Audio",
        })),
      ];

      const uniqueSensors = sensors.reduce((acc, current) => {
        if (!acc.find((sensor: { id: string; type: string }) => sensor.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, [] as { id: string; type: string }[]);

      setSensorOptions(
        uniqueSensors.map((sensor: { type: string; id: string }) => ({
          label: `${sensor.type}-${sensor.id}`,
          value: sensor.id,
        }))
      );

      const combinedData = [
        ...yearData.image_species.map((item: ImageSpecies) => ({
          id: item.camera_id,
          type: item.Type,
          device: "Camera",
          date: item.Date,
          score: item.Confidence_Score,
          name: item.Name,
          url: item.camera_id
            ? `${getBaseURL}/${getCamDir}/${item.camera_id}/${item.Type}/${item.Name}`
            : null,
        })),
        ...yearData.audio_species.map((item: AudioSpecies) => ({
          id: item.audiomoth_id,
          type: item.Type,
          device: "Audio",
          date: item.Date,
          score: item.Confidence_Score,
          name: item.Name,
          url: item.audiomoth_id
            ? `${getBaseURL}/${getAudDir}/${item.audiomoth_id}/${item.Name}`
            : null,
        })),
      ];

      setData(combinedData);
      setAllData(combinedData);
    }
  };

  const handleSensorSelect = (event: any) => {
    const selectedSensorId = event.target.value;
    setSelectedSensor(selectedSensorId);
  
    if (selectedYear && selectedMonth && selectedSensorId) {
      const selectedMonthNumber = new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth() + 1;
  
      const speciesForSensors = allData.filter(
        (item) =>
          selectedSensorId.includes(item.id) &&
          parseInt(item.date.split('-')[1], 10) === selectedMonthNumber
      );
  
      const selectedSpecies = speciesForSensors.map((item) => ({
        label: item.type,
        value: item.type,
      }));
  
      const uniqueSpecies = Array.from(
        new Set(selectedSpecies.map((spec) => spec.value))
      ).map((type) => {
        return selectedSpecies.find((spec) => spec.value === type);
      });
  
      setSpeciesOptions(uniqueSpecies as SensorOption[]);
    }
  };
  const handleMonthChange = (event: SelectChangeEvent) => {
    const month = event.target.value;
    setSelectedMonth(month);
  
    // Reset sensor and species selections
    setSelectedSensor([]);
    setSensorOptions([]);
    setSelectedSpecies(null);
    setSpeciesOptions([]);
  
    if (selectedYear && month) {
      const filterSpeciesData = siteDetails?.species_detected;
      const yearData = filterSpeciesData[0][selectedYear];
      const selectedMonthNumber = new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;
  
      const sensors = [
        ...yearData.image_species
          .filter((item: ImageSpecies) => parseInt(item.Date.split('-')[1], 10) === selectedMonthNumber)
          .map((item: ImageSpecies) => ({
            id: item.camera_id,
            type: "Camera",
          })),
        ...yearData.audio_species
          .filter((item: AudioSpecies) => parseInt(item.Date.split('-')[1], 10) === selectedMonthNumber)
          .map((item: AudioSpecies) => ({
            id: item.audiomoth_id,
            type: "Audio",
          })),
      ];
  
      const uniqueSensors = sensors.reduce((acc, current) => {
        if (!acc.find((sensor:{ type: string; id: string } ) => sensor.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, [] as { id: string; type: string }[]);
  
      setSensorOptions(
        uniqueSensors.map((sensor: { type: string; id: string }) => ({
          label: `${sensor.type}-${sensor.id}`,
          value: sensor.id,
        }))
      );
    }
  };

  const handleFilter = () => {
    const filteredData = allData.filter((item) => {
      const isYearMatched = selectedYear ? item.date.includes(selectedYear) : true;
      const isSensorMatched =
        selectedSensor.length > 0
          ? selectedSensor.some((sensorId) => sensorId === item.id)
          : true;
  
      const isSpeciesMatched = selectedSpecies ? item.type === selectedSpecies : true;
  
      const isMonthMatched = selectedMonth
        ? (() => {
            const itemMonth = parseInt(item.date.split("-")[1], 10); // Extract month as a number
            const selectedMonthNumber = new Date(
              Date.parse(`${selectedMonth} 1, 2024`)
            ).getMonth() + 1; // Convert month name to number (1-12)
            return itemMonth === selectedMonthNumber;
          })()
        : true;
  
      return isYearMatched && isSensorMatched && isSpeciesMatched && isMonthMatched;
    });
  
    setCardTitle(filteredData.length > 0 ? "Filtered Data" : "Species Data");
    setData(filteredData);
    console.log('filteredData',filteredData)
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedSensor([]);
    setSelectedSpecies(null);
    setData(allData);
  };

  const handleDownload = (selectedItems:Record<string, unknown>[]) => {
    const blob = new Blob([JSON.stringify(selectedItems, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Backdrop
        sx={{
          color: '#005F54',
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CardComponent title={'Filter Species Data'}>
        <Grid container spacing={2} sx={{ m: 2 }}>
          <Grid size={{ lg: 4, sm: 6 }}>
            <SelectComponent
              label="Year"
              options={yearOptions.map(year => ({ label: year, value: year }))}
              value={selectedYear}
              onChange={handleYearChange}
              displayEmpty
            />
          </Grid>
          <Grid size={{ lg: 4, sm: 6 }}>
            <SelectComponent
              label="Month"
              options={monthOptions.map(month => ({ label: month, value: month }))}
              value={selectedMonth}
              onChange={handleMonthChange}
              displayEmpty
            />
          </Grid>
          <Grid size={{ lg: 4, sm: 6 }}>
            <SelectComponent
              label="Sensor"
              options={sensorOptions}
              value={selectedSensor}
              onChange={handleSensorSelect}
              multiple
              displayEmpty
            />
          </Grid>
          <Grid size={{ lg: 4, sm: 6 }}>
            <SelectComponent
              label="Species"
              options={speciesOptions}
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              displayEmpty
            />
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #c4c4c4', m: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            variant="outlined"
            sx={{ m: 1, borderColor: '#005F54', color: '#005F54' }}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ m: 1, backgroundColor: '#005F54', color: '#fff' }}
            disabled={loader}
            onClick={handleFilter}
          >
            {loader ? 'Processing' : 'Apply'}
          </Button>
        </Box>
      </CardComponent>

      <Box sx={{ m: 1 }}>
        {loader ? (
          <Typography>Loading...</Typography>
        ) : data && data.length > 0 ? (
          <DownloadCardComponent
            title={cardTitle}
            btnName="Download Selected Data"
            handleButtonEvent={handleDownload}
            data={data.map((i) => i.type)}
            dataId={data.map((i) => i.name)}
            checkboxes={data.map(() => 'Check')}
            dateTitle={data.map(() => 'Date')}
            date={data.map((i) => i.date)}
            scoreTitle={data.map(() => 'Score')}
            score={data.map((i) => String(i.score))}
            url={data.map((i) => i.url ?? "")}
          />
        ) : (
          <Typography sx={{ fontSize: "20px", fontWeight: 700, textAlign: "center", margin: 3 }}>No Species found for this filter</Typography>
        )}
      </Box>
    </Box>
  );
};

export default BiodiversityDownloadFilter;
