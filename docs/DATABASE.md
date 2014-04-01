Database Structure
==================

           +-------------------------------------------+
         1 |                                           | *
    +-------------+       +-------------+       +-------------+       +-------------+
    | user        |-------| invoice     |-------| project     |-------| time        |
    +-------------+ 1   * +-------------+ ?   + +-------------+ 1   * +-------------+
    | id          |       | id          |       | id          |       | id          |
    | name        |       | user        |       | user        |       | project     |
    | mail        |       | customer    |       | invoice     |       | message     |
    | password    |       | date        |       | name        |       | start       |
    | logo        |       | counter     |       | description |       | end         |
    +-------------+       | number      |       | deadline    |       +-------------+
     1 (*) |              | (value)     |       | agreement   |
           |              | pdf         |       | finished    |
           |              +-------------+       | value       |
           |                   * |              | hours       |
           |                     |              +-------------+
           |                   1 |
           |              +-------------+
           |              | customer    |
           +--------------+-------------+
                        * | id          |
                          | user        |
                          | name        |
                          | mail        |
                          | website     |
                          | fullname    |
                          | address1    |
                          | address2    |
                          | address3    |
                          | ustid       |
                          | notes       |
                          | logo        |
                          +-------------+
