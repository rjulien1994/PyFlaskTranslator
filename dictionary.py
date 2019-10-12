#You need to download mysql and popSQL to first create your database
#you need python with the packages flask, numpy and mysql.connector
#I would usually have each of my project in their own environment to not create conflicts
#to run the server in developers mode just execute this file from cmd promt

from flask import Flask, render_template, request, session #first we import the required packages
import numpy as np
import mysql.connector

app = Flask(__name__)   #We create run the flask app

myHost = "localhost"     #These parameters are set when you build your database
myUser = "root"          #This is where you have to put your info
myPassword = "Password"
myDatabase = "dictionary"

def dbRequestUpdate(column):    #requests all queries for the variables specified
    mydb = mysql.connector.connect( #first we open the connection with the sql database
    host=myHost,   
    user=myUser,       
    passwd=myPassword,
    database=myDatabase
    )
    
    SQLCommand = "SELECT "      #since sql work by command wehave to write a request command

    for c in range(len(column)):    #this will place the variables we want into the command
        SQLCommand += column[c]
        if(c < len(column) - 1):
            SQLCommand += ','
        else:
            SQLCommand += ' '
            
            
    SQLCommand += ' FROM dict'  #we end the command by specifying the table we want the info from
    
    mycursor = mydb.cursor()    
    mycursor.execute(SQLCommand)    #we sent the command to the server
    data = np.array(mycursor.fetchall()).T  #we read the response and translate it to have array per variable
    mydb.close()    #We close the connection with the db
    
    return data

def dbInsertEntry(OneEntry):    #add an entry in database
    mydb = mysql.connector.connect(
    host=myHost,   
    user=myUser,       
    passwd=myPassword,
    database=myDatabase
    )
    
    mycursor = mydb.cursor()
    
    sql = "INSERT INTO dict(English_word, French_word, German_word) VALUES (%s,%s,%s)"  #This time we used string formatting to make the command rather than a loop because we always want the same number of values to be entered
    
    mycursor.execute(sql, OneEntry)
    mydb.commit()                   #we sent and execute the insert command to the db
    
    mydb.close()

def dbDeleteEntry(Entry):    #delete a row from db based on english word
    mydb = mysql.connector.connect(
    host=myHost,   
    user=myUser,       
    passwd=myPassword,
    database=myDatabase
    )
    
    mycursor = mydb.cursor()
    
    sql = "DELETE FROM dict WHERE English_word = '"+ Entry + "'"    #delete a query based on the english word specified
    
    mycursor.execute(sql)
    mydb.commit()
    
    mydb.close()

@app.route("/", methods=['POST','GET'])      #this is where you specify the path and methods to run the app
def translator():
    if request.method == 'POST':    #this checks if a non-human request was made
        if request.form.get('eInput') == None:  #checks the form that was sent to the url
            wordToDelete = request.form.get('toRemove') #if it was a query suppression request retrieve the query to delate
            dbDeleteEntry(wordToDelete)                 #execute suppression
        else:                                       #if it is not a delete request, it is an add request
            eWord = request.form.get('eInput')      #gets the values to add to db
            fWord = request.form.get('fInput')
            gWord = request.form.get('gInput')
        
            var = (eWord, fWord, gWord) #puts all variables in one array
        
            dbInsertEntry(var)      #adds the info to db

    FullDict = dbRequestUpdate(["English_word", "French_word", "German_word"])  #request the current info in db
    eDict = FullDict[0].tolist()    #puts info in a format that can be sent thru json
    fDict = FullDict[1].tolist()
    gDict = FullDict[2].tolist()

    return render_template('index.html', englishDict=eDict, frenchDict=fDict, germanDict=gDict) #pulls files to display info thru browser


#debug mode by running script directly and not flask run
if __name__ == '__main__':
    app.run(debug=True)
