import React, { useState } from 'react'
import { Box, Button, CardContent, Checkbox, FormControlLabel, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DownloadCardComponentProps, SelectedDataItem } from '../../Interface/Index';
import { getIntactnessRangeCategory } from '../../constants/index';

const DownloadCardComponent: React.FC<DownloadCardComponentProps> = ({
    title,
    btnName,
    handleButtonEvent,
    data,
    dataId,
    dateTitle,
    date,
    scoreTitle,
    score,
    url
}) => {
    const [enabled, setEnabled] = useState(false);
    const [selectedData, setSelectedData] = useState<SelectedDataItem[]>([]);

    const handleCheckboxChange = (index: number) => {
        const updatedSelectedData = [...selectedData];
        const selectedItem: SelectedDataItem = {
            type: typeof data[index] === "string" ? data[index] : String(data[index]),
            id: dataId[index],
            date: date[index],
            score: Number(score[index] || 0),
            url: url[index],
        };

        // Add or remove item based on checkbox state
        const itemIndex = updatedSelectedData.findIndex((item) => item.id === selectedItem.id);
        if (itemIndex >= 0) {
            updatedSelectedData.splice(itemIndex, 1);
        } else {
            updatedSelectedData.push(selectedItem);
        }

        setSelectedData(updatedSelectedData);
        setEnabled(updatedSelectedData.length > 0);
    };

    const handleClick = () => {
        handleButtonEvent(selectedData);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#151E15' }}>
                    {title}
                </Typography>

                <Button
                    onClick={handleClick}
                    disabled={!enabled}
                    sx={{
                        backgroundColor: enabled ? '#005F54' : '#c4c4c4',
                        color: '#fff !important',
                        padding: '10px'
                    }}
                >
                    {btnName}
                </Button>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {data.map((item, index) => {
                    const isAudioFile = url[index]?.endsWith('.WAV') || url[index]?.endsWith('.wav');
                    const imageUrl = isAudioFile
                        ? url[index]?.replace(/\.WAV$/i, '.png').replace(/\.wav$/i, '.png')
                        : url[index];

                    return (
                        <Grid size={{xs:1,sm:6,md:4}} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '428px',
                                    width: '100%',
                                    backgroundColor: '#151E15',
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative', flex: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '250px',
                                                cursor: isAudioFile ? 'pointer' : 'default',
                                                position: 'relative',
                                            }}
                                            onClick={() => {
                                                if (isAudioFile) {
                                                    const audioElement = document.getElementById(`audio-${index}`) as HTMLAudioElement;
                                                    if (audioElement) {
                                                        audioElement.play();
                                                    }
                                                }
                                            }}
                                        >
                                            {isAudioFile ? (
                                                <Box sx={{ paddingTop: '130px' }}>
                                                    <img
                                                        src={imageUrl}
                                                        alt="Audio Thumbnail"
                                                        style={{
                                                            height: '250px',
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                        }}
                                                    />
                                                    <audio
                                                        id={`audio-${index}`}
                                                        controls
                                                        style={{
                                                            width: '100%',
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <source src={url[index]} type="audio/wav" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </Box>
                                            ) : (
                                                <Box sx={{ paddingTop: '130px' }}>
                                                    <img
                                                        src={imageUrl}
                                                        alt="Card"
                                                        style={{
                                                            height: '250px',
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ position: 'absolute', top: '10px', left: '10px', color: '#F5F5F5' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '20px' }}>
                                                {data[index]}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ position: 'absolute', top: '10px', right: '5px' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        sx={{ color: '#F5F5F5' }}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                }
                                                label=""
                                            />
                                        </Box>

                                        <Box sx={{ position: 'absolute', bottom: '10px', right: '10px', color: '#F5F5F5' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>
                                                {scoreTitle[index]}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: '20px',
                                                    fontWeight: 800,
                                                    color: getIntactnessRangeCategory(Number(score[index]) ?? 0).color
                                                }}
                                            >
                                                {score[index]}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ position: 'absolute', bottom: '10px', left: '10px', color: '#F5F5F5' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>
                                                {dateTitle[index]}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '20px', fontWeight: 800 }}>
                                                {date[index]}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default DownloadCardComponent