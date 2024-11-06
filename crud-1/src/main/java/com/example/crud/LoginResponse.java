package com.example.crud;

public class LoginResponse {
    private String status;
    private Student student;

    public LoginResponse(String status, Student student) {
        this.setStatus(status);
        this.setStudent(student);
    }

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}
}
