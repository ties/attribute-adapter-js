# An implementation of the adapter pattern that renames variables

**But why would you want this?**: When interfacing with objects from an API which declares two
objects, with similar fields (semantics) that have different names...

The code works on ImmutableJS objects, Immutable Records (main use case), and is not totally broken
 on regular objects.
