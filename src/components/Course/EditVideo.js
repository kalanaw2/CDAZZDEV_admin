'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid2, Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import useLogout from '@/hooks/logout';

const EditVideoURLs = ({ videoOpen, setVideoOpen, videoUrls, fetchCourses, courseDetails }) => {
    const [videoUrlArray, setVideoUrlArray] = useState(videoUrls || []);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [buttonDis, setButtonDis] = useState(false)

    const { logout } = useLogout()

    useEffect(() => {
        setVideoUrlArray(videoUrls)
    }, [videoUrls])

    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = window.localStorage.getItem('token')
    }

    const handleAddUrl = () => {
        if (newVideoUrl) {
            setVideoUrlArray([...videoUrlArray, newVideoUrl]);
            setNewVideoUrl('');
        }
    };

    const handleRemoveUrl = (urlToRemove) => {
        setVideoUrlArray(videoUrlArray.filter(url => url !== urlToRemove));
    };

    const handleSave = async () => {
        if (videoUrlArray.length === 0) {
            Swal.fire({
                title: 'Please add at least one video URL.',
                icon: 'warning',
            });
            return;
        }
        Swal.fire({
            title: `Update Videos`,
            text: 'Are you sure you want to update the Videos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
            reverseButtons: true,
            customClass: {
                container: 'custom-swal-container' // Add a custom class to the container
            }
        }).then(async result => {
            if (result.isConfirmed) {
                setButtonDis(true)
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/update-videos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            id: courseDetails.id,
                           videos: videoUrlArray
                        })
                    })
                    if (response.status == 403 || response.status == 401) {
                        let refreshToken = ''
                        if (typeof localStorage !== 'undefined') {
                            refreshToken = window.localStorage.getItem('refreshToken')
                        }
                        try {
                            const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/student/token`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    refreshToken: refreshToken
                                })
                            })
                            if (tokenResponse.status == 200) {
                                const tokenData = await tokenResponse.json()
                                window.localStorage.setItem('token', tokenData.accessToken)
                                token = tokenData.accessToken
                                handleSave()
                            } else {
                                logout()
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    } else if (response.status == 200) {
                        Swal.fire({
                            title: 'Video Updated!',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            customClass: {
                                container: 'custom-swal-container' // Add a custom class to the container
                            }
                        })
                        handleEditClose()
                        fetchCourses()
                        setButtonDis(false)
                    }
                    setButtonDis(false)
                } catch (error) {
                    setButtonDis(false)
                    console.error(error)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    customClass: {
                        container: 'custom-swal-container' // Add a custom class to the container
                    }
                })
            }
        })
    };

    const handleEditClose = () => {
        setVideoOpen(false)

    }

    return (
        <Dialog open={videoOpen} onClose={handleEditClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Video URLs</DialogTitle>
            <DialogContent sx={{}}>
                <Box sx={{ mt: 2 }}>

                    <Grid2 container spacing={2} >
                        {/* Display existing video URLs */}
                        {videoUrlArray.map((url, index) => (
                            <Grid2 size={{ xs: 12 }} key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        fullWidth
                                        value={url}
                                        disabled
                                        variant="outlined"
                                        size="small"
                                        sx={{ mr: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleRemoveUrl(url)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Grid2>
                        ))}

                        {/* Input for adding a new video URL */}
                        <Grid2 size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Add Video URL"
                                variant="outlined"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                size="small"
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleAddUrl}
                    color="primary"
                    disabled={!newVideoUrl || buttonDis}
                >
                    {buttonDis ? <CircularProgress size={24} /> : 'Add URL'}
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    disabled={buttonDis}
                >
                    {buttonDis ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditVideoURLs;
