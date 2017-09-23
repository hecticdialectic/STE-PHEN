# Factor Analyses
Justin Sulik  
September 22, 2017  




```r
library(tidyverse)
library(corrplot)
library(psych)
library(GPArotation)
library(dplyr)
library(ggplot2)
```

http://personality-project.org/r/psych/HowTo/factor.pdf

# What kinds of things might you want from your data?

So far we've looked at:

- Summary statistics
- Regressions

But what if we just want to know how all the domains are related to each other? It seems silly to regress each one on all the others.

---

### Example 1:

Get student performances on tests in physics, maths, English literature, history Do you think performance will reflect general intelligence? Or is there a science intelligence and a humanities one? Or are physics and math scores driven be a science ability, and English lit. and history scores separate things?

---

### Example 2:

We wanted some individual differences tests to use in a survey. There were lots to choose from. We wanted to see how they clustered together so we could pick 1 from each cluster:

[http://sapir.psych.wisc.edu/~justin/cognitive-styles/interactivePlot.html](http://sapir.psych.wisc.edu/~justin/cognitive-styles/interactivePlot.html)

---

### Example 3:

We have too many comparisons to make and it would reduce our alpha immensely. If we somehow reduce our range of variables to more fundamental constructs, we have to make fewer comparisons. 

# How to answer these questions?

A correlation table gets us somewhere.

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-2-1.png)<!-- -->

Notice that (some) variables seem to cluster or group together. What if we want to know more about these groupings? Are they really there or are we imagining it? How many are there? 

Can you spot any cases where we can't just eyeball the groupings?

**Exercise: What information do you think would be sensible to consider when making these decisions?**

In particular, can you think of values that you'd want to maximise/minimise when assigning these to clusters?

# Dimension reduction

If we want to reduce our 9 domains to a smaller set of groups/clusters, we are essentially reducing the number of dimensions we're working with. We're trying to reduce the complexity of the observed data or posit fewer things (e.g. in our experiment: fewer distinct biases in our minds). We're trying to discover underlying structure. 

There are multiple ways to do this: factor analysis, principal components analysis, cluster analysis. These are all quite similar (especially 1st two). 

We'll not worry about the difference much, except to say that FA acts as though there is some underlying reality to the groupings. A factor is an unobserved/unobservable thing that causes the data. 

For example, perhaps all our pilot data could be explained by 4 psychological biases. Or succes in classes determined by general intelligence, not by distinct science/humanities abilities?

# Question 1: How many groups are there really? 

**Take-home message 1: there really is no objective answer to this question. It's all about the interpretation**

There are a number of methods. They often produce conflicting results. They are open to interpretation. So make sure you interpret sensibly! This is one of the greatest challenges in FA. 

For this simple intro, we're just going to focus on some common eye-balling methods

Method 1: A simple scree plot {.myImagePage}

![scree](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Yamnuska_bottom_cliff.jpg/1200px-Yamnuska_bottom_cliff.jpg)

The "elbow" is where the mountain and scree meet (where structure meets noise).


```r
# sat.act is a dataset. Explore it with ?sat.act. We're looking at the 3 measures in columns 4 to 6.

# Looking for 'elbow' (and optional arbitrary rule of thumb: >1)
# We'll discuss Eigen values shortly
VSS.scree(sat.act[4:6])
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-3-1.png)<!-- -->

Method 2: A scree plot with some comparison to a random matrix


```r
# Looking for number of points above the relevant red line (PCA vs FA)
# Better than 'arbitrary' cutoff of 1

fa.parallel(sat.act[4:6])
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-4-1.png)<!-- -->

```
## Parallel analysis suggests that the number of factors =  1  and the number of components =  1
```

Method 3: Very Simple Structure criterion


```r
# Looking for maxima!
# We'll discuss "complexity" shortly

vss(sat.act[4:6])
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-5-1.png)<!-- -->

```
## 
## Very Simple Structure
## Call: vss(x = sat.act[4:6])
## VSS complexity 1 achieves a maximimum of 0.9  with  1  factors
## VSS complexity 2 achieves a maximimum of 0.91  with  2  factors
## 
## The Velicer MAP achieves a minimum of NA  with  1  factors 
## BIC achieves a minimum of  NA  with    factors
## Sample Size adjusted BIC achieves a minimum of  NA  with    factors
## 
## Statistics by number of factors 
##   vss1 vss2  map dof   chisq prob sqresid  fit RMSEA BIC SABIC complex
## 1 0.90 0.00 0.25   0 3.1e-13   NA    0.49 0.90    NA  NA    NA     1.0
## 2 0.47 0.91 1.00  -2 0.0e+00   NA    0.48 0.91    NA  NA    NA     1.9
## 3 0.47 0.91   NA  -3 0.0e+00   NA    0.48 0.91    NA  NA    NA     1.9
##    eChisq    SRMR eCRMS eBIC
## 1 3.1e-14 2.7e-09    NA   NA
## 2 5.3e-14 3.5e-09    NA   NA
## 3 5.3e-14 3.5e-09    NA   NA
```

For a few more options, try `nfactors(sat.act)` or see `?vss` but we won't cover these today. 

**Exercise: try the above methods with two datasets: `bfi` and our `corMatrix` **

- Use columns 1:25 of the bfi dataset, and `?bfi` to find out more about it

- What seems easy or difficult about each method (in terms of straightforwardness of eyeballing it)?

- So no straightforward answer?!? What was take-home message 1? 

- This is called "Exploratory FA" 

- Interpretation/uncertainty is fine!

# Question 2: What are the groups?

A factor analysis will print out (amongst other things):

- The variables and their loadings on each factor

- Their communalities and uniquenesses 

## Loadings


```r
fit1 <- fa(bfi[1:25],nfactors=5)
fit1
```

```
## Factor Analysis using method =  minres
## Call: fa(r = bfi[1:25], nfactors = 5)
## Standardized loadings (pattern matrix) based upon correlation matrix
##      MR2   MR1   MR3   MR5   MR4   h2   u2 com
## A1  0.21  0.17  0.07 -0.41 -0.06 0.19 0.81 2.0
## A2 -0.02  0.00  0.08  0.64  0.03 0.45 0.55 1.0
## A3 -0.03  0.12  0.02  0.66  0.03 0.52 0.48 1.1
## A4 -0.06  0.06  0.19  0.43 -0.15 0.28 0.72 1.7
## A5 -0.11  0.23  0.01  0.53  0.04 0.46 0.54 1.5
## C1  0.07 -0.03  0.55 -0.02  0.15 0.33 0.67 1.2
## C2  0.15 -0.09  0.67  0.08  0.04 0.45 0.55 1.2
## C3  0.03 -0.06  0.57  0.09 -0.07 0.32 0.68 1.1
## C4  0.17  0.00 -0.61  0.04 -0.05 0.45 0.55 1.2
## C5  0.19 -0.14 -0.55  0.02  0.09 0.43 0.57 1.4
## E1 -0.06 -0.56  0.11 -0.08 -0.10 0.35 0.65 1.2
## E2  0.10 -0.68 -0.02 -0.05 -0.06 0.54 0.46 1.1
## E3  0.08  0.42  0.00  0.25  0.28 0.44 0.56 2.6
## E4  0.01  0.59  0.02  0.29 -0.08 0.53 0.47 1.5
## E5  0.15  0.42  0.27  0.05  0.21 0.40 0.60 2.6
## N1  0.81  0.10  0.00 -0.11 -0.05 0.65 0.35 1.1
## N2  0.78  0.04  0.01 -0.09  0.01 0.60 0.40 1.0
## N3  0.71 -0.10 -0.04  0.08  0.02 0.55 0.45 1.1
## N4  0.47 -0.39 -0.14  0.09  0.08 0.49 0.51 2.3
## N5  0.49 -0.20  0.00  0.21 -0.15 0.35 0.65 2.0
## O1  0.02  0.10  0.07  0.02  0.51 0.31 0.69 1.1
## O2  0.19  0.06 -0.08  0.16 -0.46 0.26 0.74 1.7
## O3  0.03  0.15  0.02  0.08  0.61 0.46 0.54 1.2
## O4  0.13 -0.32 -0.02  0.17  0.37 0.25 0.75 2.7
## O5  0.13  0.10 -0.03  0.04 -0.54 0.30 0.70 1.2
## 
##                        MR2  MR1  MR3  MR5  MR4
## SS loadings           2.57 2.20 2.03 1.99 1.59
## Proportion Var        0.10 0.09 0.08 0.08 0.06
## Cumulative Var        0.10 0.19 0.27 0.35 0.41
## Proportion Explained  0.25 0.21 0.20 0.19 0.15
## Cumulative Proportion 0.25 0.46 0.66 0.85 1.00
## 
##  With factor correlations of 
##       MR2   MR1   MR3   MR5   MR4
## MR2  1.00 -0.21 -0.19 -0.04 -0.01
## MR1 -0.21  1.00  0.23  0.33  0.17
## MR3 -0.19  0.23  1.00  0.20  0.19
## MR5 -0.04  0.33  0.20  1.00  0.19
## MR4 -0.01  0.17  0.19  0.19  1.00
## 
## Mean item complexity =  1.5
## Test of the hypothesis that 5 factors are sufficient.
## 
## The degrees of freedom for the null model are  300  and the objective function was  7.23 with Chi Square of  20163.79
## The degrees of freedom for the model are 185  and the objective function was  0.65 
## 
## The root mean square of the residuals (RMSR) is  0.03 
## The df corrected root mean square of the residuals is  0.04 
## 
## The harmonic number of observations is  2762 with the empirical chi square  1392.16  with prob <  5.6e-184 
## The total number of observations was  2800  with Likelihood Chi Square =  1808.94  with prob <  4.3e-264 
## 
## Tucker Lewis Index of factoring reliability =  0.867
## RMSEA index =  0.056  and the 90 % confidence intervals are  0.054 0.058
## BIC =  340.53
## Fit based upon off diagonal values = 0.98
## Measures of factor score adequacy             
##                                                    MR2  MR1  MR3  MR5  MR4
## Correlation of (regression) scores with factors   0.92 0.89 0.88 0.88 0.84
## Multiple R square of scores with factors          0.85 0.79 0.77 0.77 0.71
## Minimum correlation of possible factor scores     0.70 0.59 0.54 0.54 0.42
```

```r
print(fit1$loadings, cutoff=0.3)
```

```
## 
## Loadings:
##    MR2    MR1    MR3    MR5    MR4   
## A1                      -0.414       
## A2                       0.640       
## A3                       0.660       
## A4                       0.433       
## A5                       0.532       
## C1                0.546              
## C2                0.666              
## C3                0.567              
## C4               -0.614              
## C5               -0.553              
## E1        -0.557                     
## E2        -0.676                     
## E3         0.418                     
## E4         0.591                     
## E5         0.421                     
## N1  0.815                            
## N2  0.777                            
## N3  0.706                            
## N4  0.474 -0.386                     
## N5  0.486                            
## O1                              0.508
## O2                             -0.456
## O3                              0.609
## O4        -0.323                0.371
## O5                             -0.542
## 
##                  MR2   MR1   MR3   MR5   MR4
## SS loadings    2.499 1.964 1.913 1.805 1.511
## Proportion Var 0.100 0.079 0.077 0.072 0.060
## Cumulative Var 0.100 0.179 0.255 0.327 0.388
```

Columns - Factors MR1:MR5
Rows - variables
Values - loadings

What you want: 

- variables to load high on one factor, and not much on others
- each factor to have some high loadings
- factors to be interpretable!


```r
fit2 <- fa(bfi[1:25],nfactors=6)
fit2
```

```
## Factor Analysis using method =  minres
## Call: fa(r = bfi[1:25], nfactors = 6)
## Standardized loadings (pattern matrix) based upon correlation matrix
##      MR2   MR3   MR1   MR5   MR4   MR6   h2   u2 com
## A1  0.09  0.08 -0.09 -0.56  0.06  0.30 0.34 0.66 1.7
## A2  0.04  0.08 -0.04  0.68  0.00 -0.05 0.50 0.50 1.1
## A3 -0.02  0.03 -0.12  0.61  0.07  0.11 0.51 0.49 1.2
## A4 -0.07  0.19 -0.06  0.39 -0.10  0.15 0.28 0.72 2.1
## A5 -0.16  0.01 -0.19  0.45  0.13  0.21 0.47 0.53 2.3
## C1  0.01  0.54  0.06 -0.06  0.19  0.07 0.34 0.66 1.3
## C2  0.07  0.67  0.14  0.02  0.11  0.17 0.49 0.51 1.3
## C3  0.01  0.55  0.06  0.08 -0.04  0.06 0.31 0.69 1.1
## C4  0.06 -0.64  0.09 -0.06  0.07  0.30 0.57 0.43 1.5
## C5  0.15 -0.54  0.18 -0.01  0.11  0.05 0.43 0.57 1.5
## E1 -0.13  0.11  0.59 -0.12 -0.08  0.09 0.39 0.61 1.3
## E2  0.05 -0.02  0.70 -0.07 -0.06  0.03 0.56 0.44 1.0
## E3  0.00  0.00 -0.34  0.15  0.40  0.21 0.48 0.52 2.9
## E4 -0.05  0.03 -0.53  0.20  0.04  0.29 0.55 0.45 1.9
## E5  0.15  0.27 -0.40  0.05  0.23  0.01 0.40 0.60 2.8
## N1  0.84  0.01 -0.10 -0.07 -0.05  0.00 0.68 0.32 1.0
## N2  0.83  0.02 -0.06 -0.04 -0.01 -0.07 0.66 0.34 1.0
## N3  0.67 -0.03  0.13  0.07  0.05  0.08 0.54 0.46 1.1
## N4  0.43 -0.13  0.42  0.08  0.10  0.05 0.49 0.51 2.4
## N5  0.44  0.00  0.23  0.18 -0.10  0.16 0.35 0.65 2.4
## O1 -0.05  0.07 -0.04 -0.05  0.57  0.03 0.35 0.65 1.1
## O2  0.11 -0.07  0.00  0.09 -0.36  0.36 0.29 0.71 2.4
## O3 -0.02  0.02 -0.09  0.03  0.65 -0.02 0.48 0.52 1.1
## O4  0.09 -0.02  0.35  0.15  0.37 -0.04 0.25 0.75 2.5
## O5  0.03 -0.02 -0.04 -0.04 -0.45  0.41 0.37 0.63 2.0
## 
##                        MR2  MR3  MR1  MR5  MR4  MR6
## SS loadings           2.48 2.05 2.17 1.88 1.68 0.82
## Proportion Var        0.10 0.08 0.09 0.08 0.07 0.03
## Cumulative Var        0.10 0.18 0.27 0.34 0.41 0.44
## Proportion Explained  0.22 0.18 0.20 0.17 0.15 0.07
## Cumulative Proportion 0.22 0.41 0.60 0.77 0.93 1.00
## 
##  With factor correlations of 
##       MR2   MR3   MR1   MR5   MR4   MR6
## MR2  1.00 -0.18  0.25 -0.10  0.02  0.16
## MR3 -0.18  1.00 -0.21  0.19  0.19 -0.02
## MR1  0.25 -0.21  1.00 -0.30 -0.20 -0.08
## MR5 -0.10  0.19 -0.30  1.00  0.25  0.14
## MR4  0.02  0.19 -0.20  0.25  1.00  0.02
## MR6  0.16 -0.02 -0.08  0.14  0.02  1.00
## 
## Mean item complexity =  1.7
## Test of the hypothesis that 6 factors are sufficient.
## 
## The degrees of freedom for the null model are  300  and the objective function was  7.23 with Chi Square of  20163.79
## The degrees of freedom for the model are 165  and the objective function was  0.37 
## 
## The root mean square of the residuals (RMSR) is  0.02 
## The df corrected root mean square of the residuals is  0.03 
## 
## The harmonic number of observations is  2762 with the empirical chi square  639.91  with prob <  4.1e-57 
## The total number of observations was  2800  with Likelihood Chi Square =  1032.48  with prob <  1.8e-125 
## 
## Tucker Lewis Index of factoring reliability =  0.92
## RMSEA index =  0.043  and the 90 % confidence intervals are  0.041 0.046
## BIC =  -277.19
## Fit based upon off diagonal values = 0.99
## Measures of factor score adequacy             
##                                                    MR2  MR3  MR1  MR5  MR4
## Correlation of (regression) scores with factors   0.93 0.89 0.89 0.87 0.86
## Multiple R square of scores with factors          0.86 0.78 0.79 0.76 0.73
## Minimum correlation of possible factor scores     0.72 0.57 0.59 0.53 0.46
##                                                    MR6
## Correlation of (regression) scores with factors   0.77
## Multiple R square of scores with factors          0.59
## Minimum correlation of possible factor scores     0.17
```

```r
print(fit2$loadings, cutoff=0.3)
```

```
## 
## Loadings:
##    MR2    MR3    MR1    MR5    MR4    MR6   
## A1                      -0.559              
## A2                       0.682              
## A3                       0.613              
## A4                       0.391              
## A5                       0.451              
## C1         0.541                            
## C2         0.673                            
## C3         0.554                            
## C4        -0.643                       0.303
## C5        -0.543                            
## E1                0.594                     
## E2                0.695                     
## E3               -0.342         0.397       
## E4               -0.535                     
## E5               -0.399                     
## N1  0.837                                   
## N2  0.833                                   
## N3  0.673                                   
## N4  0.429         0.417                     
## N5  0.438                                   
## O1                              0.573       
## O2                             -0.359  0.359
## O3                              0.653       
## O4                0.350         0.375       
## O5                             -0.445  0.409
## 
##                  MR2   MR3   MR1   MR5   MR4   MR6
## SS loadings    2.365 1.929 1.923 1.695 1.575 0.775
## Proportion Var 0.095 0.077 0.077 0.068 0.063 0.031
## Cumulative Var 0.095 0.172 0.249 0.316 0.379 0.410
```

Does a 6th factor get us much? No? How do we tell from looking at the values?

For thresholds, see [here](http://imaging.mrc-cbu.cam.ac.uk/statswiki/FAQ/thresholds). A standard cutoff in the literature is 0.4 but that's an arbitrary rule of thumb. What was take-home message 1?

## Communalities

h2 - communality = the amount of variance in the variable explained by *all* the factors. Ideally most of the variance in a variable should be explained by our factors. 

u2 - uniqueness = 1 - communality

com - complexity

Find a variable with high complexity and one with low complexity. Try puzzle out what the difference between them is. 

# Question 3: To rotate or not to rotate?

Our aim is to uncover simple, interpretable factors (ones that have some psychological plausibility/might plausibly play a causal role in observed data)

Rotation can make the relationship between data and theoretical factors more straightforward/clearer


```r
a = runif(100, -3, 3)
b = rnorm(100, 0, 1)
c = runif(100, -3, 3)
d = rnorm(100, 0, 1)
data = data.frame(x=c(a,c),y=c(a+b,-1*(c+d)),group=c(rep('a',100),rep('b',100)))
```


```r
data %>% ggplot(aes(x=x,y=y)) + geom_point()
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-9-1.png)<!-- -->



```r
data %>% ggplot(aes(x=x,y=y,color=group)) + geom_point() + stat_smooth(method=lm)
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-10-1.png)<!-- -->

To maximise distinctiveness of factors: assume them to be orthogonal

If factors are themselves correlated: they are oblique

Factor analysis offers a number of rotations to force orthogonal vs. oblique factors

See [here](http://www.theanalysisfactor.com/rotations-factor-analysis/)

Simply pass `rotation=` to the `fa` function where the most common options are `varimax` for orthogonal and `oblimin` for oblique rotations. 

# Question 4: What can go wrong? Plenty!

This was a prime example of a case where I should have simulated data before deciding I was going to try a FA. 

It turns out it was a pretty poor fit for our pilot data. 

Oh well, it's a learning moment. 

What went wrong? Lots! Let's get diagnosing. 

Try:


```r
fa.parallel(corMatrix)
```

```
## Warning in cor.smooth(R): Matrix was not positive definite, smoothing was
## done

## Warning in cor.smooth(R): Matrix was not positive definite, smoothing was
## done

## Warning in cor.smooth(R): Matrix was not positive definite, smoothing was
## done
```

```
## Warning in cor.smooth(r): Matrix was not positive definite, smoothing was
## done

## Warning in cor.smooth(r): Matrix was not positive definite, smoothing was
## done
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-11-1.png)<!-- -->

```
## Parallel analysis suggests that the number of factors =  3  and the number of components =  3
```

Lots of warnings! Let's parse `Matrix was not positive definite, smoothing was done`. It will involve understanding Eigenvalues, but first let's see if we can spot the problem. 


```r
ev <- eigen(corMatrix)
ev$values
```

```
## [1]  3.8781129  2.0020214  1.7553292  0.7483840  0.6605314 -0.4648014
## [7]  0.3807602  0.2245406 -0.1848783
```

`Not positive definite` means there are some negative Eigen values. So what are those? 

![From wikipedia](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mona_Lisa_eigenvector_grid.png/320px-Mona_Lisa_eigenvector_grid.png)

## What caused it?

(see [here](http://www2.gsu.edu/~mkteer/npdmatri.html))

Some possibilities:

1) Redundant/collinear variables 

2) Pairwise correlation matrix/missing values

Probably 2 here: no participant rated all pairwise combinations of domains.

## What to do about it?

Well, it's a problem. But we can sidestep the issue with some smoothing (let's make the matrix symmetric while we're at it). 


```r
isSymmetric(corMatrix)
```

```
## [1] FALSE
```

```r
corSym <- corMatrix

ind <- lower.tri(corSym)
corSym[ind] <- t(corSym)[ind]
diag(corSym) <- 1
isSymmetric(corSym)
```

```
## [1] TRUE
```

```r
corSmooth <- cor.smooth(corSym,eig.tol=10^-12)
eigen(corSmooth)$values
```

```
## [1] 3.509011e+00 1.998534e+00 1.660169e+00 7.313571e-01 5.754330e-01
## [6] 3.152343e-01 2.102615e-01 9.092118e-11 8.519484e-11
```

Try again:


```r
fa.parallel(corSmooth)
```

```
## Warning in fa.parallel(corSmooth): It seems as if you are using a
## correlation matrix, but have not specified the number of cases. The number
## of subjects is arbitrarily set to be 100
```

![](factorAnalysis_slides_files/figure-html/unnamed-chunk-14-1.png)<!-- -->

```
## Parallel analysis suggests that the number of factors =  3  and the number of components =  3
```

Still not happy! Try some rotation. 


```r
fa(corSmooth, rotate='varimax',nfactors=3)
```

```
## Warning in fac(r = r, nfactors = nfactors, n.obs = n.obs, rotate =
## rotate, : An ultra-Heywood case was detected. Examine the results carefully
```

```
## Factor Analysis using method =  minres
## Call: fa(r = corSmooth, nfactors = 3, rotate = "varimax")
## Standardized loadings (pattern matrix) based upon correlation matrix
##              MR1   MR2   MR3   h2     u2 com
## Affect      0.79  0.19  0.02 0.67  0.333 1.1
## Amp         0.75  0.64  0.27 1.03 -0.033 2.2
## Brightness  0.90  0.07 -0.19 0.85  0.146 1.1
## Color       0.17  0.37  0.47 0.39  0.613 2.2
## Noise      -0.18 -0.13  0.54 0.35  0.653 1.3
## Pitch       0.08 -0.67  0.15 0.47  0.527 1.1
## Shape       0.26 -0.06  0.97 1.01 -0.012 1.1
## Size        0.14  0.80  0.01 0.66  0.340 1.1
## Speed       0.87 -0.24  0.33 0.93  0.073 1.5
## 
##                        MR1  MR2  MR3
## SS loadings           2.92 1.75 1.70
## Proportion Var        0.32 0.19 0.19
## Cumulative Var        0.32 0.52 0.71
## Proportion Explained  0.46 0.27 0.27
## Cumulative Proportion 0.46 0.73 1.00
## 
## Mean item complexity =  1.4
## Test of the hypothesis that 3 factors are sufficient.
## 
## The degrees of freedom for the null model are  36  and the objective function was  47.43
## The degrees of freedom for the model are 12  and the objective function was  41.08 
## 
## The root mean square of the residuals (RMSR) is  0.05 
## The df corrected root mean square of the residuals is  0.09 
## 
## Fit based upon off diagonal values = 0.98
```

Ultra-Heywood case? It's a communality > 1. The factors can't explain more than 100% of the variance here!


```r
fa(corSmooth, rotate='varimax',nfactors=3, fm='mle')
```

```
## Factor Analysis using method =  ml
## Call: fa(r = corSmooth, nfactors = 3, rotate = "varimax", fm = "mle")
## Standardized loadings (pattern matrix) based upon correlation matrix
##              ML1   ML3   ML2   h2     u2 com
## Affect      0.78  0.15  0.01 0.64 0.3621 1.1
## Amp         0.77  0.57  0.27 1.00 0.0049 2.1
## Brightness  0.84  0.15 -0.12 0.74 0.2581 1.1
## Color       0.16  0.37  0.54 0.45 0.5507 2.0
## Noise      -0.11 -0.14  0.53 0.31 0.6870 1.2
## Pitch      -0.07 -0.69  0.22 0.53 0.4682 1.2
## Shape       0.25 -0.08  0.96 1.00 0.0050 1.1
## Size        0.07  0.94  0.07 0.88 0.1152 1.0
## Speed       0.91 -0.27  0.30 1.00 0.0048 1.4
## 
##                        ML1  ML3  ML2
## SS loadings           2.85 1.96 1.73
## Proportion Var        0.32 0.22 0.19
## Cumulative Var        0.32 0.54 0.73
## Proportion Explained  0.44 0.30 0.26
## Cumulative Proportion 0.44 0.74 1.00
## 
## Mean item complexity =  1.4
## Test of the hypothesis that 3 factors are sufficient.
## 
## The degrees of freedom for the null model are  36  and the objective function was  47.43
## The degrees of freedom for the model are 12  and the objective function was  40.41 
## 
## The root mean square of the residuals (RMSR) is  0.08 
## The df corrected root mean square of the residuals is  0.14 
## 
## Fit based upon off diagonal values = 0.96
## Measures of factor score adequacy             
##                                                    ML1  ML3  ML2
## Correlation of (regression) scores with factors   1.00 0.99 1.00
## Multiple R square of scores with factors          0.99 0.99 0.99
## Minimum correlation of possible factor scores     0.99 0.98 0.99
```

Happy? Well, noise has very low communality, so not well predicted by our factors. 


```r
#Drop 'noise'
corSmooth2 <- corSmooth[-5,-5]

fit <- fa(corSmooth2, rotate='varimax',nfactors=3, fm='mle')
print(fit$loadings,cutoff=0.3)
```

```
## 
## Loadings:
##            ML1    ML2    ML3   
## Affect      0.718              
## Amp         0.732  0.558  0.384
## Brightness  0.992              
## Color              0.439  0.484
## Pitch             -0.724       
## Shape                     0.720
## Size               0.911       
## Speed       0.762         0.581
## 
##                  ML1   ML2   ML3
## SS loadings    2.693 1.950 1.357
## Proportion Var 0.337 0.244 0.170
## Cumulative Var 0.337 0.580 0.750
```

How well does this fit our intuitions from the correlation plot? And from what we thought would help decide clusters?

**Exercise: let's try the new data!**
