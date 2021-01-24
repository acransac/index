# Description
**index** provides investments performance measurement utilities. It works from time series of assets values and cash flows read from a json file. This file is independently managed.

Two measures are provided:
  * An index quantifies the relative performance of some investments between the last and past evaluations. The last reading is a number giving the variation in percentage from the previous evaluation (e.g.: the last index value is -1.23 means the assets depreciated by 1.23 % in the period between the last evaluation and the one before). This approach is sensitive to cash flows in and out of the investment fund so that comparisons of index values before and after addition or substraction of invested cash tend to lose meaning.
  * A rate of return from inception, based on time-corrected cash flows. The sequence of cash flows considered are all past cash ins and outs and a hypothetical full sale and cash out at the date of evaluation.

The index series can be recalculated in one pass over the assets values and cash flows time series. The rate of return series requires one pass for every point in time.
