
library(jsonlite)

# load data
raw_data <- fromJSON(paste(readLines("isla_data.json"), collapse=""))
trial_data <- subset(raw_data, raw_data$trial_type == "turk-pit")