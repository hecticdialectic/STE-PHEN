import pandas as pd

import numpy as np

import argparse

def predict(filename):

	predictions = pd.read_csv(filename)

	print("- Succesfully read predictions dataframe.")

	covered_comparisons = predictions[predictions.Prediction.notnull()].Comparison.values

	global_mean = predictions.Prediction.mean()

	all_comparisons = pd.read_csv('_Predictions.csv').Comparison.copy()

	def get_comparitor(row):
		c = row['Comparison']
		a,b = c.split('-')
		if 'Affect' in a:
			return b
		return a

	predictions['comparitor'] = predictions.apply(get_comparitor, axis = 1)

	print("- Deteced {0} predictions.".format(covered_comparisons.shape[0]))
	print("- Imputing {0} remaining predictions now.".format(all_comparisons.shape[0] - covered_comparisons.shape[0]))

	def impute_prediction(row):

		comparison = row['Comparison']

		if comparison in covered_comparisons:
			return row['Prediction']

		d1, d2 = comparison.split('-')

		d1_data = predictions[predictions.comparitor == d1]
		d2_data = predictions[predictions.comparitor == d2]

		if (d1_data.isnull().shape[0] != d1_data.shape[0]) and (d2_data.isnull().shape[0] != d2_data.shape[0]):
			d1_mean = d1_data.Prediction.mean()
			d2_mean = d2_data.Prediction.mean()

			return np.mean([d1_mean, d2_mean])

		else:
			return global_mean

	predictions['ImputedPrediction'] = predictions.apply(impute_prediction, axis = 1)

	print("- Finished imputing predictions.")
	print("- Saving data to MyImputedPredictions.csv")

	predictions.to_csv('MyImputedPredictions.csv', index = False)

	print("- Complete.")



if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('-f', '--filename')
	args = parser.parse_args()
	predict(args.filename)








