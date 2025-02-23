'use client'
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useLogout from "@/hooks/logout";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
    course: yup
        .string()
        .required("Course ID is required"),
    student: yup.string().required("Student ID is required"),
});

const defaultValues = {
    course: "",
    student: "",
   
};
const AddEnrol = ({ setEditOpen, editOpen, fetchStudents }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { logout } = useLogout();

    let token = "";
    if (typeof localStorage !== "undefined") {
        token = window.localStorage.getItem("token");
    }

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const onSubmit = async (data) => {
        console.log(data)
        Swal.fire({
            title: `Add Enrolment`,
            text: "Are you sure you want to add the Enrolment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancel",
            confirmButtonText: "Confirm",
            reverseButtons: true,
            customClass: {
                container: "custom-swal-container", // Add a custom class to the container
            },
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/add-enrolment`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                course: data.course,
                                student: data.student,
                            }),
                        }
                    );
                    if (response.status == 403 || response.status == 401) {
                        let refreshToken = "";
                        if (typeof localStorage !== "undefined") {
                            refreshToken = window.localStorage.getItem("refreshToken");
                        }

                        try {
                            const tokenResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/student/token`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        refreshToken: refreshToken,
                                    }),
                                }
                            );
                            if (tokenResponse.status == 200) {
                                const tokendata = await tokenResponse.json();
                                window.localStorage.setItem("token", tokendata.accessToken);
                                token = tokendata.accessToken;
                                handleSave();
                            } else {
                                logout();
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    } else if (response.status == 201) {
                        Swal.fire({
                            title: "Course Enrolment Created!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            customClass: {
                                container: "custom-swal-container", // Add a custom class to the container
                            },
                        });
                        handleEditClose();
                        fetchStudents();

                    }
                    
                } catch (error) {

                    console.error(error);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    customClass: {
                        container: "custom-swal-container", // Add a custom class to the container
                    },
                });
            }
        });
    };

    return (
        <div>
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="user-view-edit"
                aria-describedby="user-view-edit-description"
                sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
                <DialogTitle
                    id="user-view-edit"
                    sx={{
                        textAlign: "center",
                        fontSize: "1.5rem !important",
                    }}
                >
                    Add Enrolment
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Course ID"
                                        rules={{ required: true }}
                                        {...register("course")}
                                        error={Boolean(errors.course)}
                                        helperText={errors.course && errors.course.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Student ID"
                                        rules={{ required: true }}
                                        {...register("student")}
                                        error={Boolean(errors.student)}
                                        helperText={errors.student && errors.student.message}
                                    />
                                </Grid2>
                               
                            </Grid2>

                            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4, gap:1 }}>
                                <Button variant="contained" type="submit">
                                    Submit
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleEditClose}>
                                    Cancel
                                </Button>
                            </Box>

                        </form>

                    </Box>
                </DialogContent>
              
            </Dialog>
        </div>
    );
};

export default AddEnrol;
