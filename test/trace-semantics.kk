module trace-semantics

import kokaine/reactive
import std/core/unsafe

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun get-hidden(value : ref<global,a>) : a
  unsafe-total { !value }

fun put-hidden(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  put-hidden(target,get-hidden(target) + 1)

fun push(target : ref<global,list<a>>, value : a) : ()
  put-hidden(target,Cons(value,get-hidden(target)))

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-ints(actual : list<int>, expected : list<int>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun test-exact-suffix-and-frontier()
  val before-first = hidden(0)
  val after-a = hidden(0)
  val after-b = hidden(0)
  val seen = hidden([])

  val (root,(a,b,stop)) = create-root fn(root)
    val a = signal(root,1)
    val b = signal(root,10)
    val stop = create-effect(root,fn()
      bump(before-first)
      val av = a.get
      bump(after-a)
      val bv = b.get
      bump(after-b)
      av + bv
    ,fn(value) push(seen,value))
    (a,b,stop)

  get-hidden(before-first).check-int(1,"initial prefix")
  get-hidden(after-a).check-int(1,"initial after a")
  get-hidden(after-b).check-int(1,"initial after b")
  get-hidden(seen).check-ints([11],"initial publication")

  update(root){ b.set(20) }
  get-hidden(before-first).check-int(1,"b resumes after prefix")
  get-hidden(after-a).check-int(1,"b resumes after a suffix")
  get-hidden(after-b).check-int(2,"b resumes exact suffix")
  get-hidden(seen).check-ints([21,11],"b publication")

  update(root){ a.set(2) }
  get-hidden(before-first).check-int(1,"a does not rerun pre-read prefix")
  get-hidden(after-a).check-int(2,"a resumes its suffix")
  get-hidden(after-b).check-int(3,"a rebuilds downstream b suffix")
  get-hidden(seen).check-ints([22,21,11],"a publication")

  update(root)
    batch(root)
      a.set(3)
      b.set(30)
  get-hidden(after-a).check-int(3,"batch resumes outer frontier once")
  get-hidden(after-b).check-int(4,"batch retires queued child")
  get-hidden(seen).check-ints([33,22,21,11],"batch coherent publication")

  stop()
  update(root)
    batch(root)
      a.set(4)
      b.set(40)
  get-hidden(seen).check-ints([33,22,21,11],"disposed trace cannot publish")
  root.dispose()

fun test-dynamic-child-retirement()
  val after-choice = hidden(0)
  val after-branch = hidden(0)
  val seen = hidden([])

  val (root,(choose,left,right,stop)) = create-root fn(root)
    val choose = signal(root,True)
    val left = signal(root,1)
    val right = signal(root,10)
    val stop = create-effect(root,fn()
      val selected = choose.get
      bump(after-choice)
      val value = if selected then left.get else right.get
      bump(after-branch)
      value
    ,fn(value) push(seen,value))
    (choose,left,right,stop)

  update(root){ right.set(11) }
  get-hidden(seen).check-ints([1],"inactive branch has no capture")

  update(root){ left.set(2) }
  get-hidden(after-choice).check-int(1,"leaf update resumes after branch choice")
  get-hidden(after-branch).check-int(2,"active leaf resumes exact suffix")
  get-hidden(seen).check-ints([2,1],"active branch publication")

  update(root)
    batch(root)
      choose.set(False)
      right.set(12)
  get-hidden(after-choice).check-int(2,"choice resumes once")
  get-hidden(after-branch).check-int(3,"new child sees final batch value")
  get-hidden(seen).check-ints([12,2,1],"branch switch publication")

  update(root){ left.set(3) }
  get-hidden(seen).check-ints([12,2,1],"retired branch cannot publish")
  update(root){ right.set(13) }
  get-hidden(seen).check-ints([13,12,2,1],"new branch remains live")
  stop()
  root.dispose()

fun test-duplicate-read-frontier()
  val after-first = hidden(0)
  val after-second = hidden(0)
  val seen = hidden([])

  val (root,(value,stop)) = create-root fn(root)
    val value = signal(root,1)
    val stop = create-effect(root,fn()
      val first = value.get
      bump(after-first)
      val second = value.get
      bump(after-second)
      first + second
    ,fn(current) push(seen,current))
    (value,stop)

  update(root){ value.set(2) }
  get-hidden(after-first).check-int(2,
    "outer duplicate capture is the runnable frontier")
  get-hidden(after-second).check-int(2,
    "queued inner duplicate capture is retired")
  get-hidden(seen).check-ints([4,2],
    "one source invalidation publishes duplicate-read suffix once")
  stop()
  root.dispose()

fun test-failed-draft-does-not-escape()
  val fail = hidden(False)
  val applies = hidden(0)
  val seen = hidden([])

  val (root,(a,b,stop)) = create-root fn(root)
    val a = signal(root,1)
    val b = signal(root,10)
    val stop = create-effect(root,fn()
      val av = a.get
      val bv = b.get
      av + bv
    ,fn(value)
      bump(applies)
      if get-hidden(fail) then throw("intentional apply failure")
      else push(seen,value)
    )
    (a,b,stop)

  put-hidden(fail,True)
  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ a.set(2) }
  }
  check(failed.is-error,"failed resumed suffix escapes update")
  get-hidden(seen).check-ints([11],"failed draft publishes nothing")

  put-hidden(fail,False)
  update(root){ a.set(3) }
  get-hidden(seen).check-ints([13,11],"pending parent retries once")

  update(root){ b.set(20) }
  get-hidden(seen).check-ints([23,13,11],
    "failed draft capture was retired before later child invalidation")
  get-hidden(applies).check-int(4,
    "one initial, one failed, one retry, one later child apply")
  stop()
  root.dispose()

fun test-failed-parent-keeps-frontier-gate()
  val should-fail = hidden(False)
  val seen = hidden([])

  val (root,(a,b,stop)) = create-root fn(root)
    val a = signal(root,1)
    val b = signal(root,10)
    val stop = create-effect(root,fn()
      val av = a.get
      val bv = b.get
      av + bv
    ,fn(value)
      if get-hidden(should-fail) then throw("intentional frontier failure")
      else push(seen,value)
    )
    (a,b,stop)

  put-hidden(should-fail,True)
  val failed : error<()> = mask<exn>{
    error/try fn()
      update(root)
        batch(root)
          a.set(2)
          b.set(11)
  }
  check(failed.is-error,"failed outer frontier escapes update")
  get-hidden(seen).check-ints([11],"failed frontier leaves last commit visible")

  put-hidden(should-fail,False)
  update(root){ b.set(12) }
  get-hidden(seen).check-ints([14,11],
    "old pending child stays gated until failed parent retries")
  stop()
  root.dispose()

pub fun main()
  test-exact-suffix-and-frontier()
  test-dynamic-child-retirement()
  test-duplicate-read-frontier()
  test-failed-draft-does-not-escape()
  test-failed-parent-keeps-frontier-gate()
  println("trace-semantics: all checks passed")
