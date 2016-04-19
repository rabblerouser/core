Contributing to RabbleRouser
============================

To contribute, fork the repo and submit a pull request. We like testing. Ideally TDDing. So please include tests where appropriate.

Our current architectural principles:
-------------------------------------

* apps should be able to be deployed independently and function alone or in concert
* apps communicate asynchronously with each other through events (and only events)
* apps should be written in whatever language seems right
* all data must be encrypted at rest and in transit
* the environment should be simple to deploy
* the environment should be as secure as we can make it
* the event store is the source of truth
* the environment should be as cheap as possible to run for small organisations, but can scale up when necessary

All technical decisions should be filtered through these principles.

