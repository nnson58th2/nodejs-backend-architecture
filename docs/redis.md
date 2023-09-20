Top 5 câu hỏi phổ biến:

-   Redis là gì? Redis là một cơ sở dữ liệu, nhưng khác với cơ sở dữ liệu truyền thống là được lưu trong bộ nhớ đệm (ram)
    "Thường để cập đến khoá phân tán, transaction, lập lệnh, cluster, ..vv.."
-   Tại sao sử dụng redis và dùng redis để làm cache: Hiệu suất cao và đồng thời cao
    -   Hiệu suất cao: người dùng truy cập vào CSDL để truy xuất dữ liệu quá trình này sẽ chậm hơn vì được đọc từ disk; các lần truy cập tiếp theo sẽ truy cập lấy từ bộ đệm
    -   Đồng thời cao: các yêu cầu bộ đệm hoạt động trực tiếp có thể chịu được bao nhiêu, nhiều hơn so với truy cập vào CSDL. Vì vậy chúng ta có thể xem xét chuyển 1 phần dữ liệu trong CSDL sang bộ nhớ đệm.
-   Memcached vs Redis
-   Redis có bao nhiêu kiểu dữ liệu? Và kịch bản sử dụng?
    -   string (chuỗi): get, set, getm, setm
    -   Hash (băm): hget, hset, hgetall
    -   List (danh sách): lpush, lpop, rpush, rpop
    -   Set (tập hợp)
    -   Zset (tập hợp có thứ tự)
    -   BitMap (mới trong phiên bản 2.2)
    -   HyperLogLog (mới trong phiên bản 2.8)
    -   GEO (mới trong phiên bản 3.2)
    -   Stream (mới trong phiên bản 5.0)
-   Redis giải quyết cơ chế hết hạn dữ liệu thế nào?

### STRING

-   embstring (<= 44 bytes)
    -   SET str 1234566789012345678901234567890123456789abcd
    -   object encoding str -> 'embstr' | 'raw' | 'int'
-   raw (> 44 bytes)
-   int (integer)

-   Thao tác cơ bản trên chuỗi (string)
    -   SET name anonystick
    -   GET name
    -   EXISTS name1 -> "0"
    -   EXISTS name -> "1"
    -   STRLEN name -> "10"
    -   DEL name -> "1"
    -   DEL name1 -> "0"
    -   MSET key1 value1 key2 value2
    -   MGET key1 key2
    -   SET 0001:like 0
    -   INCR 0001:like -> 1
    -   GET 0001:like -> "1"
    -   INCRBY 0001:like 8 -> 9
    -   DECR 0001:like -> 8
    -   DECRBY 0001:like 5 -> 3
    -   KEYS '0001:\*' (tìm kiếm các key)
    -   KEYS 'n\*' -> "num"
    -   EXPIRE name 60 -> 1
    -   TTL name -> 50
    -   SET key value EX 60
    -   SETNX key value1
    -   SET lock_key unique_value NX PX 10000 (hệ thống phân tán)

### HASH

-   Cấu trúc Hash
-   Các lệnh phổ biến
    -   HSET user:01 name son
    -   HSET user:01 name son age 25
    -   HGET user:01 name
    -   HMSET user:02 name son age 25
    -   HDEL user:02 age
    -   HLEN user:01
    -   HGETALL user:01
    -   HEXISTS user:01 age
    -   HINCRBY user:01 age 1
    -   HKEYS user:01
    -   HVALS user:01
-   Khi dùng nào Hash: Dùng làm giỏ hàng là phổ biến
    -   HSET uid:01 name son age 25
    -   HSET uid:02 name suong age 25
    -   HSETALL uid:01

### LIST

-   LPUSH list:01 a b c
-   LRANGE list:01 0 -1
-   RPUSH list:01 1 2 3
-   LPOP list:01
-   LPOP list:01 2
-   RPOP list:01
-   LRANGE list:01 0 3
-   LRANGE list:01 1 3
-   BLPOP list:01 0
-   LINDEX list:01 2
-   LLEN list:01
-   LREM list:01 1 b
-   LTRIM list:01 1 4
-   EXISTS list:01
-   LSET list:01 0 c-update
-   LINSERT list:01 BEFORE b bb
-   LINSERT list:01 AFTER 1 11

### SET (Tập hợp không thứ tự)

-   SADD cr7 juve real manu
-   SMEMBERS cr7
-   SREM cr7 manu
-   SCARD cr7 (lấy số lượng)
-   SISMEMBER cr7 juve -> 1 (Tìm tồn tại)
-   SRANDMEMBER cr7 1
-   SPOP cr7 1
-   SMOVE cr7 m10 real
-   SMEMBER m10
-   SMEMBER cr7 -> (empty array)

-   SADD cr7 1 2 3 4 5 6 7
-   SADD m10 5 6 7 8 9 10
-   SINTER cr7 m10 (Tìm điểm chung)
-   SDIFF cr7 m10 (Tìm điểm khác biệt)
