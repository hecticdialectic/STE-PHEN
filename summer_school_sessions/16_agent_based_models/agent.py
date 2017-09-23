import numpy as np
import scipy.stats


class Agent(object):

	def __init__(self, nmeanings, nsignals, prior = None):
		self.nmeanings = nmeanings
		self.nsignals = nsignals
		self.meanings = np.arange(self.nmeanings)
		self.memory = prior
		self.signal_probabilities = np.array([scipy.stats.dirichlet(singal_counts).rvs(size = 1) for singal_counts in self.memory]).reshape(self.memory.shape)

	def speak(self):
		topic = np.random.randint(self.nmeanings)

		signal = np.random.choice(self.meanings, size = 1, p = self.signal_probabilities[topic])[0]

		return (topic, signal)

	def listen(self, signal, nsamples = 1):
		meaning_likelihoods = self.signal_probabilities[:,signal]

		meaning_posterior =  meaning_likelihoods / sum(meaning_likelihoods)

		return np.random.choice(self.meanings, size = nsamples, p = meaning_posterior)

	def increment_count(self, i, j):
		self.memory[i,j] += 1
		self.signal_probabilities[i] = scipy.stats.dirichlet(self.memory[i]).rvs(size = 1)
	
	def decrement_count(self, i, j):
		self.memory[i,j] -= 1

	def inhibit(self, row = None, col = None, exception = None):

		if row is not None:

			self.memory[row, :][self.memory[row, :] > 1] -= 1

			if exception is not None: self.memory[row, exception] += 1

		if col is not None:

			self.memory[:, col][self.memory[:, col] > 1] -= 1

			if exception is not None: self.memory[exception, col] += 1


