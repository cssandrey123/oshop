package com.twproject.oshop.exceptions;

public class NotAvailableException extends RuntimeException {
    public NotAvailableException(){
        super("Already taken.");
    }
}
