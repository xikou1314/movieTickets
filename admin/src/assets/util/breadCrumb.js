export default function createBreadCrumb(paths,menuData) {
  var breadcrumb=[];
  for(var i of menuData)
  {
      if(paths.indexOf(i.path)>=0)
      {
          breadcrumb.push({
              path:i.path,
              text:i.name
          });
          if(i.children)
          {
              for(var j of i.children)
              {
                  if(paths.indexOf(j.path)>=0)
                  {
                      breadcrumb.push({
                          path:j.path,
                          text:j.name
                      });
                  }
              }
          }
      }

      
  }
  return breadcrumb;
}