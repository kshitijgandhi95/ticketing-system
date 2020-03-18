# API and Migration 

## migration 
    use command migrate-mongo up to migrate the db

## cancel-ticket
    type - post
    body - {
        "seatNum": <number>
    }
    returns successful or rejected

## book-ticket
    type - post
    body - {
        "seatNum": <number>
        "userDetails": {
		"name": <string>,
		"phoneNumber": <number>,
		"emailId": <string>
	    }
    }
    return successful or rejected

## ticket-status/id 
    type - get
    id represents seat number       
    returns booked or available
     
## available-tickets
    type - get
    returns an array of available tickets

## booked-tickets
    type - get
    returns an array of booked tickets

## reset/id
    type - get
    id represents admin id - is set to 2345
    resets tickets    