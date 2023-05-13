import random
import pandas as pd

data_cases = 10
v1_range = 20
v2_range = 20
v3_range = 100

# create a datafrme with 10 rows and 3 columns with random values

data = {
    'v1': [random.randint(0, v1_range) for i in range(data_cases)],
    'v2': [random.randint(0, v2_range) for i in range(data_cases)],
    'v3': [random.randint(1, v3_range) for i in range(data_cases)]
}

df = pd.DataFrame(data) 
#  save the dataframe as a json file
df.reset_index(drop=True, inplace=True)
print(df)
df.to_json('./trivariate.json', orient='records')
