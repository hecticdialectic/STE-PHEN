import numpy as np
import scipy

import itertools

import agent



class Population(object):

	def __init__(self, n, prior, nmeanings, nsignals):
		self.n = n # number of agents
		self.nmeanings = nmeanings
		self.nsignals = nsignals
		self.prior = prior
		self.agents = [agent.Agent(prior = prior.copy(), nmeanings = nmeanings, nsignals = nsignals) for a in xrange(self.n)]

	def communicate(self, speaker, listener):
		topic, signal = speaker.speak()

		interpretations = listener.listen(signal, nsamples = 5)

		for interpretation in interpretations:
			
			if interpretation == topic: 
			
				listener.increment_count(topic, signal)

				listener.inhibit(col = signal, exception = topic)

				return

		listener.increment_count(topic, signal)

	def score_pair(self, speaker, listener):
		return np.mean(np.sum(speaker.signal_probabilities * listener.signal_probabilities, axis = 1))

	def score_population(self):

		self.score = 0
		
		# Accuracies are symmetric, so only check unique pairs
		# i.e. only check upper triangle of matrix
		(indeces_i, indeces_j) = np.triu_indices(self.n, 1)

		for (i,j) in itertools.izip(indeces_i, indeces_j):

			self.score += self.score_pair(self.agents[i], self.agents[j])

		self.score /= len(indeces_i)

		return self.score

	def get_convention(self):
		out = np.zeros(self.prior.shape)

		for meaning in xrange(self.prior.shape[0]):
			out[meaning] = np.mean([agent.memory[meaning] for agent in self.agents], axis = 0)

		return out

	def transmit(self, k, save = False):

		scores = np.zeros(k) if save else None

		for g in xrange(k):

			speaker, hearer = np.random.choice(self.agents, size = 2, replace = False)

			self.communicate(speaker, hearer)

			if save:

				scores[g] = self.score_population()

		return scores if save else self.score_population()

	def converge(self, threshold = 0.9, maxiter = 100000, chunksize = 10):

		counter = 0

		self.score_population()

		while self.score < threshold:

			self.transmit(maxiter / chunksize, save = False)

			self.score_population()

			if counter >= maxiter: 

				break

			counter += (maxiter / chunksize)
