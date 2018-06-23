```
cat example.watup | ./bin -
```
### `(define $name $body*)`

Defines are exact "search and replace" without any evaluations. They are like
macros without arguments.

```watup
(define $PI (f64.const 3.14159))

(define $TAU (f64.mul $PI (f64.const 2)))

(return (f64.sin (get_local $radians) $TAU))
```

```wat
;; Future versions may statically evaluate $TAU to a f64.const
(return (f64.sin (get_local $radians)
                 (f64.mul (f64.const 3.14159)
                          (f64.const 2))))
```


### `(macro $name $args $body*)`

#### Simple replacement

```watup
(macro i32.add_in_place ($x $y)
  (set_local $x (i32.add (get_local $x)
                         (get_local $y))))

(local $a i32)
(local $b i32)

(i32.add_in_place $a $b)
```

```wat
(local $a i32)
(local $b i32)

(set_local $a (i32.add (get_local $a)
                       (get_local $b)))
```

#### Instruction replacement

```watup
(macro i8.load_grey_pixel (#ptr)
 (i32.div_u (i32.add (i32.load8_u offset=0 #ptr)
                     (i32.add (i32.load8_u offset=1 #ptr)
                              (i32.load8_u offset=2 #ptr)))
            (i32.const 3)))

(param $input.ptr i32)

(i8.load_grey_pixel (get_local $input.ptr))
```

```wat
(param $input.ptr i32)

(i32.div_u (i32.add (i32.load8_u offset=0 (get_local $input.ptr))
                    (i32.add (i32.load8_u offset=1 (get_local $input.ptr))
                             (i32.load8_u offset=2 (get_local $input.ptr))))
           (i32.const 3))
```

### `(unroll $placeholder $data $body*)`

#### Simple unroll

```watup
(unroll #idx (seq 0 3)
  (local $x{#idx} i32))
```

```wat
(local $x0 i32)
(local $x1 i32)
(local $x2 i32)
```

#### Nested unroll

```watup
(unroll #i (seq 0 16 4)
  (unroll #j '($a $b $c)
    (i32.load offset={#i} (get_local {#j})))
```

```wat
(i32.load offset=0 (get_local $a))
(i32.load offset=0 (get_local $b))
(i32.load offset=0 (get_local $c))
(i32.load offset=4 (get_local $a))
(i32.load offset=4 (get_local $b))
(i32.load offset=4 (get_local $c))
(i32.load offset=12 (get_local $a))
(i32.load offset=12 (get_local $b))
(i32.load offset=12 (get_local $c))
```

#### Destructuring

```watup
(define #IV '(
  (128 0x6a09e667f3bcc908)
  (136 0xbb67ae8584caa73b)
  (144 0x3c6ef372fe94f82b)
  (152 0xa54ff53a5f1d36f1)
  (160 0x510e527fade682d1)
  (168 0x9b05688c2b3e6c1f)
  (176 0x1f83d9abfb41bd6b)
  (184 0x5be0cd19137e2179)))

(param $ptr i32)

(unroll (#offset #const) #IV
  (i64.store offset={#offset} (get_local $ptr) (i64.const {#const})))
```

```wat
(param $ptr i32)

(i64.store offset=128 (get_local $ptr) (i64.const 0x6a09e667f3bcc908))
(i64.store offset=136 (get_local $ptr) (i64.const 0xbb67ae8584caa73b))
(i64.store offset=144 (get_local $ptr) (i64.const 0x3c6ef372fe94f82b))
(i64.store offset=152 (get_local $ptr) (i64.const 0xa54ff53a5f1d36f1))
(i64.store offset=160 (get_local $ptr) (i64.const 0x510e527fade682d1))
(i64.store offset=168 (get_local $ptr) (i64.const 0x9b05688c2b3e6c1f))
(i64.store offset=176 (get_local $ptr) (i64.const 0x1f83d9abfb41bd6b))
(i64.store offset=184 (get_local $ptr) (i64.const 0x5be0cd19137e2179))
```
