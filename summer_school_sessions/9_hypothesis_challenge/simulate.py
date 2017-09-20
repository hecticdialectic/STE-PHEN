import pandas as pd

import numpy as np

import argparse

def main(filename):

	predictions = pd.read_csv(filename)

	print "- Succesfully read in predictions."
	print "- Simulating data now."

	results_dataframe = pd.read_csv('SimTrials.csv')

	probability_lookup = dict(zip(predictions.Comparison, predictions.ImputedPrediction))

	def simulate_data(row):
		return np.random.binomial(n = 1, p = probability_lookup[row['Comparison']])

	results_dataframe['ResponseSimulated'] = results_dataframe.apply(simulate_data, axis = 1)    

	print "- Simulation complete."

	results_dataframe.to_csv('SimDataFilled.csv', index = False)

	print "- Saved simulated data to SimDataFilled.csv"

	
if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('-f', '--filename')
	args = parser.parse_args()
	main(args.filename)








