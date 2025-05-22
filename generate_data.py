import json
import random
import argparse
import math
from datetime import datetime, timedelta

def generate_random_data(index, magnitude_of_size = 0, dropout_rate = 0.1, ceil_value = 300, date = datetime.now().isoformat()):
    if index < 0:
        print("Warning: The index is unexpectedly a negative integer.")
    elif index == 0:
        #This should not happen, but if it does, we set the index_magnitude to 0.
        #Otherwise the log10 of 0 is undefined, and we would get an error.
        print("Warning: The index is unexpectedly zero.")
        index_magnitude = 0
    else:
        index_magnitude = math.floor(math.log10(index))

    prepend = ""
    
    if magnitude_of_size != 0 and index_magnitude <= magnitude_of_size:
        prepend = "0" * (magnitude_of_size - index_magnitude)
    else:
        print("Warning: The magnitude of size is not set, or the index is larger than the dataset. The index will be used as is.")

    #We expect the given date to be in ISO format, and use the datetime library to give variety to the date.
    #I am personally not certain of what datetime can handle, 
    try:
        base_date = datetime.fromisoformat(date) 
        adjusted_date = base_date + timedelta(minutes=5 * index) 
        adjusted_date_str = adjusted_date.isoformat() 
    except ValueError:
        print("Warning: The date is not in ISO format, or a format that can be directly converted. Using the time of calling this function instead.")
        adjusted_date_str = datetime.now().isoformat()

    # Decide whether to include the "value" field based on the dropout rate
    value = None if random.uniform(0, 1) < dropout_rate else random.uniform(0, ceil_value)

    return {
        "id": "sim_" + prepend + str(index),
        "timestamp": adjusted_date_str,
        "value": value,
        "parameter_set": random.choice(["Alpha", "Beta", "Gamma", "Set", "Delta"]),
        "status": random.choice(["completed", "running", "failed", "pending"])
    }

def save_to_json_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate random data and save to a JSON file.")
    parser.add_argument(
        "--num_data_points",
        type=int,
        default=random.randint(100, 200),
        help="Number of data points to generate (default: random between 100 and 200)."
    )
    parser.add_argument(
        "--output_file",
        type=str,
        default="./public/data_sample.json",
        help="Output JSON file name (default: data_sample.json)."
    )
    parser.add_argument(
        "--seed",
        type=int,
        default= None,
        help="Assigns seed for randomness. The number of data points is by default random between 100 and 200. The seed does not affect the number of data points, but it does affect the randomness of the generated data."
    )
    parser.add_argument(
        "--dropout_rate",
        type=float,
        default=0.1,
        help="The rate at which the value field is set to None (default: 0.1)."
    )
    args = parser.parse_args()

    num_data_points = args.num_data_points
    if num_data_points == 0:
        print("Error: The number of data points is zero. No data will be changed.")
        exit(1)
    output_file = args.output_file
    seed = args.seed
    if seed is not None:
        random.seed(seed)

    dropout_rate = args.dropout_rate
    if dropout_rate < 0 or dropout_rate > 1:
        print("Error: The dropout rate must be between 0 and 1.")
        exit(1)

    magnitude_of_size = math.floor(math.log10(num_data_points))

    if magnitude_of_size > 3:
        print("Warning: The number of data points is large. Consider using a smaller number for better performance.")
    if num_data_points < 0:
        print("Error: The number of data points must be a non-negative integer.")
        exit(1)
    random_data_list = [0] * num_data_points
    for i in range(num_data_points):
        random_data = generate_random_data(index = i+1, magnitude_of_size = magnitude_of_size, dropout_rate = dropout_rate)
        if random_data is None:
            print("Error: The generated data is None. This should not be possible outside of a crash.")
            exit(1)
        random_data_list[i] = random_data
    save_to_json_file(random_data_list, output_file)
    print(f"{num_data_points} random data points saved to {output_file}")