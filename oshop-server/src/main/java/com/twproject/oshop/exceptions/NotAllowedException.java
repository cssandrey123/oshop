package com.twproject.oshop.exceptions;

public class NotAllowedException extends RuntimeException {
    public NotAllowedException(){
        super("Operation not permitted.");
    }
}