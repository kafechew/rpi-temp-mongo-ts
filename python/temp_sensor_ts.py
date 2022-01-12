import os
import glob
import time

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

def get_database():
    from pymongo import MongoClient
    import pymongo

    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb+srv://kafechew:PASSWORD@temperaturepi.jys1a.mongodb.net/temperature?retryWrites=true&w=majority"

    # Create a connection using MongoClient. You can import MongoClient or us>
    from pymongo import MongoClient
    client = MongoClient(CONNECTION_STRING)

    # Create the database for our example (we will use the same database thro>
    return client['sensor_db']

# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":

    # Get the database
    dbname = get_database()
    collection_name = dbname["temperature_col"]

def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c

while True:
        print(read_temp())
        from datetime import datetime
        data = {
        "temperature": read_temp(),
        "timestamp": datetime.utcnow()
        }

        deviceId = 1
        collection_name.update_one(
        {'deviceId': deviceId, 'nsamples': {'$lt': 200}},
        {
            '$push': {'samples': data},
            '$min': {'first': data['timestamp']},
            '$max': {'last': data['timestamp']},
            '$inc': {'nsamples': 1}
        },
        upsert=True
        )
        time.sleep(1)