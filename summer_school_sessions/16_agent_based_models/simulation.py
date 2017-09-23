import population
import seaborn as sns
import numpy as np

def format_bias_matrix(biases):

	assert np.all((np.array(biases.values()) <= 1) & (np.array(biases.values()) >= 0)) # make sure nobody entered illegal biases

	m = np.array([biases['size-pitch'], 1 - biases['size-pitch'], biases['size-noise'], 1 - biases['size-noise'],
	 1 - biases['size-pitch'],biases['size-pitch'], 1 - biases['size-noise'],biases['size-noise'],
	 biases['shape-pitch'],1 - biases['shape-pitch'], biases['shape-noise'],1 - biases['shape-noise'],
	 1 - biases['shape-pitch'],biases['shape-pitch'],1 - biases['shape-noise'],biases['shape-noise']]).reshape((4,4)) 
	
	for i in range(4):
		m[i] /= m[i].sum()

	return m * 10

def simulate(biases):

	print("** Starting simulation now **")

	prior = format_bias_matrix(biases)

	pop = population.Population(n = 25, prior = prior, nmeanings = 4, nsignals = 4)

	print("	- Succesfully created population.")
	print("	- Running signalling games now. Please wait...")
	
	pop.converge(threshold = 0.95, maxiter = 1000000)

	print("	- Signalling games complete.")

	convention = pop.get_convention()

	print("	- Population reached {0}% communicative alignment.".format(pop.score_population() * 100))

	print("** Simulation completed successfully. **")

	return convention

def plot_prior(biases):
	prior = format_bias_matrix(biases)

	prior = prior / prior.sum(axis = 1)

	ax = sns.heatmap(prior, yticklabels = ['small-thing', 'large-thing', 'square-thing', 'circular-thing'], xticklabels = ['low-pitch', 'high-pitch', 'low-noise', 'high-noise'], linewidths = .5, vmin = 0, vmax = 1)

	ax.xaxis.tick_top()

	sns.plt.yticks(rotation = 0)
	
	sns.plt.ylabel('Meanings')
	sns.plt.xlabel('Signals')

def plot_language(convention):

	convention = convention / convention.sum(axis = 1)

	ax = sns.heatmap(convention, yticklabels = ['small-thing', 'large-thing', 'square-thing', 'circular-thing'], xticklabels = ['low-pitch', 'high-pitch', 'low-noise', 'high-noise'], linewidths = .5, vmin = 0, vmax = 1)
	
	ax.xaxis.tick_top()

	sns.plt.yticks(rotation = 0)

	sns.plt.ylabel('Meanings')
	sns.plt.xlabel('Signals')






			