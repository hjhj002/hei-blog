import { useRequest } from 'alova/client';
import { ExternalLink, Github } from 'lucide-react';
import { getProjects } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function Projects() {
  const { data: projects = [], loading } = useRequest(() => getProjects());

  return (
    <main className="mx-auto w-full max-w-[1160px] px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">
        项目
      </p>
      <h1 className="mt-3 text-4xl">做过的、在做的和想做的小东西。</h1>
      <p className="mt-4 max-w-[34em] text-lg text-muted-foreground">
        这里是一些我独立完成或参与的项目，主要是工具、组件和实验。
      </p>

      {loading ? (
        <p className="mt-10 text-muted-foreground">加载中…</p>
      ) : projects.length === 0 ? (
        <p className="mt-10 text-muted-foreground">还没有项目。</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col rounded-[18px] border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl">{project.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto flex gap-4 pt-5 text-sm font-semibold text-accent-foreground">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    链接
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    源码
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
