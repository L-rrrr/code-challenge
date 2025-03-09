var sum_to_n_a = function(n) {
    // your code here
    for (var i = 1; i <= n; i++) {
        n += i;
    }
    return n;
};

var sum_to_n_b = function(n) {
    // your code here
    return n * (n + 1) / 2;
};

var sum_to_n_c = function(n) {
    // your code here
    if (n === 1) {
        return 1;
    } else {
        return n + sum_to_n_c(n - 1);
    }
};