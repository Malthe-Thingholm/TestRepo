##  Simple Simulation Data Dashboard

#How To Run Both Parts
The Python script is runnable either in the src folder or in root, by running python3 generate_data.py with potentially any of the flags as descriped in the file. The React/Vite dashboard itself is runnable by running "npm run dev" in root. This should be done after installing all dependencies, which hopefully is straightforward by running "npm install" in root, however the Plotly dependency might be a hindrance, in which case running "npm install --save plotly.js npm install --save-dev @types/plotly.js" might additionally be needed.

#Thoughts about project
I've split the elements into three parts (with the intention of having a fourth for the data generation itself, alas it remains necessary to run the Python file from the terminal), namely the data loading through a button, and the two data visualisations through a table and a bar-chart. MaterialUI provides most of the functionality of the table, and Plotly provides most of the visualisation for the chart. The data reading and augmentation are seperated out into methods that don't return elements, instead they "carry" the data. I'm split to whether they should be exported or not. 
#Dependencies
The project is dependent on Plotly and MaterialUI, as well as various standard libraries both for Python and Typescript. Additionally Vite provides the framework for the app itself.
#Assumptions on date/timestamp-format
I've assumed that the particulars of the date-format didn't matter too much, so I didn't specify the format generated to be an exact copy. However I did copy that the variation in timestamp could just be five minute increments from the data-sample shown. Additionally I've made some assumptions surrounding positiveness of integers in a variety of places wrt. the data format. 
#Testing/Time
The code doesn't include unit tests, I've manually tested a bit, but hooking up unit testing ended up taking me outside of the intended time-frame so I stopped that process. My time-split is roughly: 1 hour for Python, 1 hour for core Typescript, 2-3 hours for making the Typescript work right and reformatting, 1 hour spent on looking into ways to execute Python in browser with the ability to write files and figuring out unit testing. The last mentioned hour not resolving in any element. 

To give a breakdown of the time-input into this: Roughly an hour for the Python file, roughly an hour of trying out the feasibility of testing and hosting the Python via backend properly, roughly an hour for the core LoadData file, somewhere between two and three hours for formatting the LoadData file, ensuring it works, and figuring out the styling (I think around 45 minutes on one specific css thing that just was in a deprecated file).
