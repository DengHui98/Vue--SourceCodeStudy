import { type EffectReactive } from "./effect";
import { type ComputedRefImp } from "./computed";

/**
 * 订阅者
 */
export interface Sub {
  deps: Link | undefined;
  depsTail: Link | undefined;
  tracking: boolean;
}
/**
 * 依赖项
 */
export interface Dependency {
  subs: Link | undefined;
  subsTail: Link | undefined;
}

export interface Link {
  sub: EffectReactive | ComputedRefImp | undefined;
  prevSub: Link | undefined;
  nextSub: Link | undefined;
  dep: Dependency | undefined;
  nextDep: Link | undefined;
}

let linkPool: Link | undefined = undefined;
/**
 * 链表关系
 * @param dep
 * @param sub
 * @returns
 */
export function link(dep: Dependency, sub: EffectReactive) {
  // 判断是否已经收集了依赖
  const currentDep = sub.depsTail;

  const nexDep = currentDep === undefined ? sub.deps : currentDep.nextDep;
  if (nexDep && nexDep.dep === dep) {
    // 将 sub 指针移动
    sub.depsTail = nexDep;
    return;
  }

  let newLink: Link | undefined = undefined;
  if (linkPool) {
    // 从 linkPool 中获取一个 link
    newLink = linkPool;
    linkPool = linkPool.nextDep;
    newLink.nextDep = nexDep;
    newLink.dep = dep;
    newLink.sub = sub;
  } else {
    newLink = {
      sub,
      dep,
      nextDep: nexDep,
      prevSub: undefined,
      nextSub: undefined,
    };
  }
  // 判断链表是否有数据
  if (dep.subsTail) {
    dep.subsTail.nextSub = newLink;
    newLink.prevSub = dep.subsTail;
    dep.subsTail = newLink;
  } else {
    dep.subs = newLink;
    dep.subsTail = newLink;
  }

  // 添加deps
  if (sub.depsTail) {
    sub.depsTail.nextDep = newLink;
    sub.depsTail = newLink;
  } else {
    sub.deps = newLink;
    sub.depsTail = newLink;
  }
}
/**
 * 更新计算属性
 */
function processComputedUpdate(sub: ComputedRefImp) {
  if (sub.subs && sub.update()) {
    propagate(sub.subs);
  }
}
/**
 * 派发依赖更新
 * @param subs
 */
export function propagate(subs: Link) {
  let link: Link | undefined = subs;
  let queuedEffect = [];
  while (link) {
    const sub = link.sub;
    if (sub && !sub.tracking && !sub.dirty) {
      sub.dirty = true;
      if ("update" in sub) {
        processComputedUpdate(sub);
      } else {
        // 没有正在收集依赖，出发更新
        queuedEffect.push(sub);
      }
    }
    link = link.nextSub;
  }
  queuedEffect.forEach((subs) => {
    subs?.notify();
  });
}

/**
 * 开始收集依赖
 */
export function startTracking(dep: Sub) {
  dep.tracking = true;
  // 将 depsTail 重置为 undefined
  dep.depsTail = undefined;
}

/**
 * 结束收集依赖
 */
export function endTracking(sub: Sub) {
  const depsTail = sub.depsTail;
  sub.tracking = false;
  if (depsTail) {
    if (depsTail.nextDep) {
      // 需要清理依赖
      clearTracking(depsTail.nextDep);
      depsTail.nextDep = undefined;
    }
  } else if (sub.deps) {
    // 清理依赖
    clearTracking(sub.deps);
    sub.deps = undefined;
  }
}

/**
 * 清理依赖
 */
export function clearTracking(link: Link | undefined) {
  while (link) {
    const { dep, nextDep, prevSub, sub, nextSub } = link;
    /**
     * 如果 prevSub 存在，说明是链表的中间节点
     * 如果不存在，说明是链表的头节点
     */
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.nextSub = undefined;
    } else {
      dep && (dep.subs = nextSub as Link);
    }

    /**
     * 如果 nextSub 存在，说明是链表的中间节点
     * 如果不存在，说明是链表的尾节点
     */
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.prevSub = undefined;
    } else {
      dep && (dep.subsTail = prevSub as Link);
    }

    link.dep = link.sub = undefined;
    link.nextDep = linkPool;
    linkPool = link;
    // 将 link 赋值为下一个 link
    link = nextDep;
  }
}
