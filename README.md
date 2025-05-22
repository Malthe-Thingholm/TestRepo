# React + TypeScript + Vite

My solution is split into the Python script, and a couple of different elements in the "LoadData.tsx" file. The .tsx file includes a couple of methods for retrieving the data from the stored .json, and then a couple of methods for getting each rendered element tagged "Element" in the end of their function-name. 

I believe the project is runnable by visiting the root folder and writing "npm install", and then "npm run dev" (should also work with fx. yarn). As mentioned below, you might run into issues with Plotly. The Python app is run as "python3 generate_data.py", possibly with flags as described further below.

Vite was used as the main "template"/building/delivery mechanism. I've mainly used "create-react-app" before that was deprecated. 
The two main libraries used were Plotly and MaterialUI. The installment of the Plotly library is hopefully smooth, but for usage with typescript you may have to explicitly type it. This is a bit tough for me to test as I only have access to one non-windows OS installment right now.
I believe I only had to explicitly execute "npm install --save plotly.js npm install --save-dev @types/plotly.js"

As the given document specifically calls for the python script in the root, I've made a copy of it there. It is functionally the same as the one in the source folder. 
I've made four flags possible for its execution. "seed", "dropout_rate", "num_data_points", and "output_file". They should be fairly self-explanatory, but the seed is for randomness exempting the number of data points which that flag controls. Dropout rate is to simulate missing data per the task given, and defaults to 10% (0.1). The output location defaults to where and how it is used by the remaining code, so I wouldn't recommend changing that. 

I've not really included much testing. I've manually tested for improper data formats, and the data not being there. I haven't used unit testing libraries for Typescript before, but any tests I'd come up with would generally follow the format of "Good input, do we get expected object", "Bad input, do we get an expected Error". 
The main real testable (other than ensuring no unexpected crashes) is the performance_index augmentation. As there is the possibility of dividing by 0 if the input is bad and you don't handle it. 

I believe I've mentioned it in a comment somewhere in the code, but it was my original intention to include a data-generation button. Hooking the Python script up with it such that it wrote to a .json file instead of returning the data became tedious so i dropped it. Mainly to respect the given timeframe of 4-6 hours of work. 

To give a breakdown of the time-input into this: Roughly an hour for the Python file, roughly an hour of trying out the feasibility of testing and hosting the Python via backend properly, roughly an hour for the core LoadData file, somewhere between two and three hours for formatting the LoadData file, ensuring it works, and figuring out the styling (I think around 45 minutes on one specific css thing that just was in a deprecated file).
